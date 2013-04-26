define([
	'jquery',
	'app/module/socket',
	'app/module/canvas',
	'app/module/storage',
	'app/collection/Paths',
	'app/view/Tools',
	'app/view/Cursor'
], function($, socket, canvas, storage, Paths, Tools, Cursor) {
	var EVT = 'ontouchend' in window.document ? {
		start : 'touchstart',
		move : 'touchmove',
		end : 'touchend'
	} : {
		start : 'mousedown',
		move : 'mousemove',
		end : 'mouseup'
	};

	var app = {
		CANVAS : 'canvas',
		CURSOR : 'cursor',
		connectIdElm: null,
		pathCollection: null,
		toolBtns: null,
		cursor: null,
		clientId : 'id' + Math.round($.now()*Math.random()),
		isDrow : false,
		pastX : 0,
		pastY : 0,
		clients : {},
		tapInterval : 0,
		switchInterval : 1000,
		outputType: "",
		init: function() {
			app.connectIdElm = $('#connectId');
			app.pathCollection = new Paths();
			outputType = app.CURSOR;

			socket.init();
			$(window).on(socket.ON_SOCKET_DATA, app.onSocketData);
			$(window).on(socket.ON_NEW_CONNECT, app.onNewConnected);

			canvas.init();
			canvas.element.addEventListener(EVT.start, this, false);

			app.cursor = new Cursor({
				collection : app.pathCollection
			});

			// save
			$('#saveBtn').on('click', $.proxy(this.save, this));

			app.toolInit();
		},
		toolInit: function() {
			app.toolBtns = new Tools({
				collection : app.pathCollection,
				canvas: canvas
			});
			app.toolBtns.on(Tools.TOUCH_CLEAR, function() {
				canvas.clear();
				app.pathCollection.reset();
			});
			app.toolBtns.on(Tools.TOUCH_UNDO, function(e) {
				app.pathCollection.undo();
				canvas.undo(app.pathCollection.models);
				app.pathCollection.trigger('change');
			});
			app.toolBtns.on(Tools.TOUCH_REDO, function() {
				app.pathCollection.redo();
				canvas.redo(app.pathCollection.models);
			});
			app.toolBtns.on(Tools.TOUCH_SAVE, function() {
				canvas.save();
			});
			app.toolBtns.on(Tools.CHANGE_TOOL_TYPE, function(name) {
				canvas.setDrawType(name);
			});
		},
		// クライアント用
		// handleEvent : function(e) {
		// 	var action;
		// 	e.preventDefault();
		// 	canvas.element.addEventListener(EVT.start, app, false);
		// 	switch (e.type) {
		// 		case EVT.start:
		// 			action = 'start';
		// 			app.isDrow = true;
		// 			app.pathDataList = [];
		// 			app.pastX = app.startX =canvas.getPosX(e);
		// 			app.pastY = app.startY = canvas.getPosY(e);
		// 			canvas.element.addEventListener(EVT.move, app, false);
		// 			canvas.element.addEventListener(EVT.end, app, false);
		// 			break;
		// 		case EVT.move:
		// 			action = 'move';
		// 			if(!app.isDrow) return;
		// 			e.preventDefault();
		// 			break;
		// 		case EVT.end:
		// 			action = 'end';
		// 			if(!app.isDrow) return;
		// 			app.isDrow = false;
		// 			canvas.element.removeEventListener(EVT.move, app, false);
		// 			canvas.element.removeEventListener(EVT.end, app, false);

		// 			app.pathCollection.add({
		// 				paths : app.pathDataList,
		// 				color : '#000',
		// 				thickness : '1',
		// 				type : 'pencil'
		// 			}, true);
		// 			break;
		// 		default :
		// 			break;
		// 	}
		// 	var endX = canvas.getPosX(e),
		// 		endY = canvas.getPosY(e);


		// 	app.pathDataList.push({
		// 		startX: app.pastX,
		// 		startY: app.pastY,
		// 		endX: endX,
		// 		endY: endY
		// 	})

		// 	if(e.type !== EVT.start) {
		// 		canvas.drawLine(
		// 			app.pastX,
		// 			app.pastY,
		// 			endX,
		// 			endY
		// 		);
				
		// 		app.pastX = endX;
		// 		app.pastY = endY;
		// 	}
		// 	socket.sendData({
		// 		paths : app.pathDataList,
		// 		color : '#000',
		// 		thickness : '1',
		// 		type : 'pencil'
		// 	});
		// },
		handleEvent : function(event) {
			event.preventDefault();
			
			switch (event.type) {
				case EVT.start:
					app.isDrow = true;
					app.startHandler(event);

					break;
				case EVT.move:
					if(!app.isDrow) return;

					break;
				case EVT.end:
					if(!app.isDrow) return;
					app.isDrow = false;
					app.endHandler(event);

					break;
				default :
					break;
			}

			app.drawHandler(event);
		},
		startHandler: function(event) {
			app.pathDataList = [];
			app.pastX = canvas.getPosX(event);
			app.pastY = canvas.getPosY(event);
			document.addEventListener(EVT.move, app, false);
			document.addEventListener(EVT.end, app, false);

			if (app.tapInterval === 0) {
				app.outputType = app.CURSOR;
				app.cursor.show();
			}else {
				app.tapInterval = +new Date - app.tapInterval;
				if (app.tapInterval < app.switchInterval) {
					app.outputType = app.CANVAS;
				}else {
					app.outputType = app.CURSOR;
					app.cursor.show();
				}
			}
		},
		endHandler: function(event) {
			document.removeEventListener(EVT.move, app, false);
			document.removeEventListener(EVT.end, app, false);

			if (app.outputType === app.CURSOR) {
				app.cursor.hide();	
			}else if (app.outputType === app.CANVAS){
				//タッチスタートからタッチエンドまでのパス情報をコレクションに追加
				app.pathCollection.add({
					paths : app.pathDataList,
					color : '#000',
					thickness : '1',
					type : 'pencil'
				}, true);
			}
			
			app.tapInterval = +new Date;

			//一定時間たったらoutputTypeをCURSORにするための処理 ※バグありそう
			setTimeout(function() {
				app.tapInterval = 0;
			}, app.switchInterval);
		},
		drawHandler: function(event) {
			var endX = canvas.getPosX(event),
				endY = canvas.getPosY(event);

			app.pathDataList.push({
				startX: app.pastX,
				startY: app.pastY,
				endX: endX,
				endY: endY
			});

			if (app.outputType === app.CURSOR) {
				app.cursor.position(endX, endY);

			}else if (app.outputType === app.CANVAS) {
				if(event.type !== EVT.start) {
					canvas.drawLine(
						app.pastX,
						app.pastY,
						endX,
						endY
					);
					app.pastX = endX;
					app.pastY = endY;
				}
			}
			
			socket.sendData({
				paths : {
					startX: app.pastX,
					startY: app.pastY,
					endX: endX,
					endY: endY
				},
				color : '#000',
				thickness : '1',
				type : 'pencil',
				user : {
					name : '',
					img : ''
				}
			});
		},
		onSocketData :function(e, data) {
			canvas.draw(data.action, data);
		},
		save: function(e) {
			console.log('click save button');
			var url = '/room_save';

			var data = canvas.getDataUrl(),
				id = $(e.target).data('id');

			$.ajax({
				type: 'POST',
				url: url,
				data: {
					id: id,
					data: data
				}
			});
			if(!app.clients[data.clientId]) {
				app.clients[data.clientId] = {};
				app.clients[data.clientId].isDrow = false;
			}

			var target = app.clients[data.clientId];

			switch (data.action) {
				case 'start':
					target.isDrow = true;
					target.pastX = data.x;
					target.pastY = data.y;
					break;
				case 'move':
					if(!target.isDrow) return;
					break;
				case 'end':
					if(!target.isDrow) return;
					target.isDrow = false;
					break;
				default :
					break;
			}

			if(data.action !== 'start') {
				// console.log(target.pastX, target.pastY,	data.x,	data.y);
				canvas.drawLine(
					target.pastX,
					target.pastY,
					data.x,
					data.y
				);
				target.pastX = data.x;
				target.pastY = data.y;
			}

		},
		onNewConnected : function(e, data) {
			console.log(data);
			app.connectIdElm.append('<span>'+data.socketid+'</span>,');
		}
	};


	return app;
});
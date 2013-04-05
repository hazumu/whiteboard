define([
	'jquery',
	'/socket.io/socket.io.js',
	'app/module/socket',
	'app/module/canvas',
	'app/model/DrawState',
	'app/collection/Paths',
	'app/view/Tools'
], function($, io, socket, canvas, DrawState, Paths, Tools) {
	var toolBtns, pathCollection, drawState;
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
		init: function() {
			app.clientId = 'id' + Math.round($.now()*Math.random());
			app.isDrow = false;
			app.pastX = 0;
			app.pastY = 0;
			app.connectIdElm = $('#connectId');
			app.clients = {};

			socket.init();
			$(window).on(socket.ON_SOCKET_DATA, app.onSocketData);
			$(window).on(socket.ON_NEW_CONNECT, app.onNewConnected);

			canvas.init();
			canvas.element.addEventListener(EVT.start, this, false);

			// save
			$('#saveBtn').on('click', $.proxy(this.save, this));

			app.toolInit();
		},
		toolInit: function() {
			drawState = new DrawState();
			pathCollection = new Paths();
			toolBtns = new Tools({
				el : '.tools-container',
				model : drawState,
				collection : pathCollection,
				canvas: canvas
			});
			toolBtns.on(Tools.TOUCH_CLEAR, function() {
				canvas.clear();
				pathCollection.reset();
			});
			toolBtns.on(Tools.TOUCH_UNDO, function(e) {
				pathCollection.undo();
				canvas.undo(pathCollection.models);
				pathCollection.trigger('change');
			});
			toolBtns.on(Tools.TOUCH_REDO, function() {
				pathCollection.redo();
				canvas.redo(pathCollection.models);
				pathCollection.trigger('change');
			});
			toolBtns.on(Tools.TOUCH_SAVE, function() {
				canvas.save();
			});
		},
		handleEvent : function(e) {
			var action;
			e.preventDefault();
			canvas.element.addEventListener(EVT.start, app, false);
			switch (e.type) {
				case EVT.start:
					action = 'start';
					app.isDrow = true;
					app.pathDataList = [];
					app.pastX = app.startX =canvas.getPosX(e);
					app.pastY = app.startY = canvas.getPosY(e);
					canvas.element.addEventListener(EVT.move, app, false);
					canvas.element.addEventListener(EVT.end, app, false);
					break;
				case EVT.move:
					action = 'move';
					if(!app.isDrow) return;
					e.preventDefault();
					break;
				case EVT.end:
					action = 'end';
					if(!app.isDrow) return;
					app.isDrow = false;
					canvas.element.removeEventListener(EVT.move, app, false);
					canvas.element.removeEventListener(EVT.end, app, false);

					pathCollection.add({
						paths : app.pathDataList,
						color : '#000',
						thickness : '1',
						type : 'pencil'
					});
					break;
				default :
					break;
			}
			var endX = canvas.getPosX(e),
				endY = canvas.getPosY(e);


			app.pathDataList.push({
				startX: app.pastX,
				startY: app.pastY,
				endX: endX,
				endY: endY
			})

			if(e.type !== EVT.start) {
				canvas.drawLine(
					app.pastX,
					app.pastY,
					endX,
					endY
				);
				
				app.pastX = endX;
				app.pastY = endY;
			}
			socket.sendData({
				action : action,
				x : canvas.getPosX(e),
				y : canvas.getPosY(e),
				id : app.clientId
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
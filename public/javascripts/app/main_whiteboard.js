define([
	'jquery',
	'app/module/util',
	'app/module/socket',
	'app/view/Canvas',
	'app/collection/Paths',
	'app/view/Cursor'
], function($, util, socket, Canvas, Paths, Cursor) {
	var EVT = util.EVT;
	var app = {
		users : [],
		init: function() {
			socket.init();
			$(window).on(socket.ON_SOCKET_DATA, app.onSocketData);
			$(window).on(socket.ON_NEW_CONNECT, app.onNewConnected);
		},
		onSocketData :function(e, data) {
			console.log("white",data);
			if (!app.users[data.id]) {
				app.users[data.id] = new app.User(data.socketid,{
					thumbnailPath: data.user.img
				});
			}

			if (data.type === 'draw') {
				app.users[data.id].handleEvent(data);
			}else if (data.type === 'button') {
				app.users[data.id].runButtonMethod(data);
			}
		},
		onNewConnected : function(e, data) {
			console.log(data);
			if (!app.users[data.socketid]) {
				app.users[data.socketid] = new app.User(data.socketid, {
					thumbnailPath: data.user.img
				});
			}
		}
	};

	var User = function(socketid, options) {
		this.id = socketid;
		this.options = options;
		this.init();
	};
	User.prototype = {
		cursor : null,
		init: function() {
			this.createCursor();
			this.createCanvas();
			this.pathCollection = new Paths();
		},
		createCursor : function() {
			var copyCursorElm = $('.cursor-container').clone();
			copyCursorElm[0].setAttribute("id", this.id + "_corsor");
			$('.wrapper').append(copyCursorElm[0]);
			this.cursor = new Cursor({
				el : '#' + this.id + "_corsor",
				imgpath: this.options.thumbnailPath
			});
		},
		createCanvas: function() {
			var copyCanvasElm = $('#canvas').clone();
			copyCanvasElm[0].setAttribute("id", this.id + "_canvas");
			$('.wrapper').append(copyCanvasElm[0]);
			this.canvas = new Canvas({
				el : '#' + this.id + "_canvas"
			});
		},
		handleEvent : function(data) {
			switch (data.eventType) {
				case EVT.start:
					this.startHandler(data);
					break;
				case EVT.move:
					this.moveHandler(data);
					break;
				case EVT.end:
					this.endHandler(data);

					break;
				default :
					break;
			}
		},
		startHandler: function(data) {
			var position = this.getPos(data, 'start');
			this.pastX = position.x;
			this.pastY = position.y;
			this.pathDataList = [];

			this.canvas.setDrawType(data.drawInfo.name);
			if (data.outputType === 'cursor') {
				this.cursor.show();
			}else {
				this.cursor.hide();
			}
		},
		moveHandler: function(data) {
			var position = this.getPos(data, 'end'),
				endX = position.x,
				endY = position.y;

			if (data.outputType === 'cursor') {
				this.cursor.position(endX, endY);
			}else if (data.outputType === 'canvas') {

				if(data.eventType !== EVT.start) {
					this.pathDataList.push({
						startX: this.pastX,
						startY: this.pastY,
						endX: endX,
						endY: endY
					});
					this.canvas.drawLine(
						this.pastX,
						this.pastY,
						endX,
						endY
					);
					this.pastX = endX;
					this.pastY = endY;
				}
			}
		},
		endHandler: function(data) {
			if (data.outputType === 'canvas') {
				console.log("data", data);
				this.pathCollection.add({
					paths : this.pathDataList,
					color : '#000',
					thickness : '1',
					type : 'pencil'
				}, true);
			}
		},
		getPos: function(data, type) {
			var x,y;
			if (type === 'start') {
				x = data.paths.startX / data.canvasW * this.canvas.el.width;
				y = data.paths.startY / data.canvasH * this.canvas.el.height;
			}else if (type === 'end') {
				x = data.paths.endX / data.canvasW * this.canvas.el.width;
				y = data.paths.endY / data.canvasH * this.canvas.el.height;
			}else {
				return null;
			}
			return {
				x : x,
				y : y
			};
		},
		runButtonMethod: function(data) {
			console.log(data);
			switch (data.buttonType) {
				case 'clear':
					this.canvas.clear();
					break;
				case 'undo':
					this.pathCollection.undo();
					this.canvas.undo(this.pathCollection.models);
					break;
				case 'redo':
					this.canvas.redo(data.paths);
					break;
				default :
					break;
			}
		}
	};

	app.User = User;

	return app;
});
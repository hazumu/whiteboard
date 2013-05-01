define([
	'jquery',
	'app/module/util',
	'app/module/socket',
	'app/module/canvas',
	'app/collection/Paths',
	'app/view/Cursor'
], function($, util, socket, canvas, Paths, Cursor) {
	var EVT = util.EVT;
	var app = {
		users : [],
		init: function() {
			canvas.init();
			socket.init();
			$(window).on(socket.ON_SOCKET_DATA, app.onSocketData);
			$(window).on(socket.ON_NEW_CONNECT, app.onNewConnected);
		},
		onSocketData :function(e, data) {
			console.log(data);
			if (app.users[data.id]) {
				app.users[data.id].handleEvent(data);
			}else {
				throw new Error('app.users[data.socketid] is undefined');
			}
		},
		onNewConnected : function(e, data) {
			console.log(data);
			if (!app.users[data.socketid]) {
				app.users[data.socketid] = new app.User(data.socketid);
			}
		}
	};

	var User = function(socketid) {
		this.id = socketid;
		this.init();
	};
	User.prototype = {
		cursor : null,
		init: function() {
			this.createCursor();
		},
		createCursor : function() {
			var copyCursorElm = $('.cursor-container').clone();
			copyCursorElm[0].setAttribute("id", this.id);
			$('.wrapper').append(copyCursorElm[0]);
			this.cursor = new Cursor({
				el : '#' + this.id
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
			this.pastX = data.paths.startX;
			this.pastY = data.paths.startY;

			if (data.outputType === 'cursor') {
				this.cursor.show();
			}else {
				this.cursor.hide();
			}
		},
		moveHandler: function(data) {
			var endX = data.paths.endX,
				endY = data.paths.endY;

			if (data.outputType === 'cursor') {
				this.cursor.position(endX, endY);
			}else if (data.outputType === 'canvas') {
				if(data.eventType !== EVT.start) {
					canvas.drawLine(
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

		}
	};

	app.User = User;

	return app;
});
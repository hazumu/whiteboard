(function($, window, undefined) {

	var EVT = 'ontouchend' in window.document ? {
		start : 'touchstart',
		move : 'touchmove',
		end : 'touchend'
	} : {
		start : 'mousedown',
		move : 'mousemove',
		end : 'mouseup'
	};

	var socket = {
		ON_SOCKET_DATA : 'ON_SOCKET_DATA',
		connectUrl : 'http://whitebord.herokuapp.com/',
		init : function() {
			socket.io = io.connect(socket.connectUrl);
			socket.io.on('connect', socket.onConnected);
			socket.io.on('message', socket.onMessage);
		},
		onConnected : function(msg) {
			document.getElementById("connectId").innerHTML = "接続ID::" + socket.io.socket.transport.sessid;
			document.getElementById("type").innerHTML = "接続方式::" + socket.io.socket.transport.name;
		},
		onMessage : function(data) {
			$(window).trigger(socket.ON_SOCKET_DATA, [data.value]);
		},
		sendData : function(data) {
			socket.io.emit('message', {value : data});
		},
		disConnect : function() {
			var msg = socket.io.socket.transport.sessid + "は切断しました。";
			// メッセージを発射する
			socket.io.emit('message', {
				value: msg
			});
			// socketを切断する
			socket.io.disconnect();
		}
	};

	var canvas = {
		canvasId : 'canvas',
		init : function() {
			canvas.element = document.getElementById(canvas.canvasId);
			canvas.ctx = canvas.element.getContext("2d");
			canvas.isDrow = false;
		},
		draw : function(type, data) {
			var ctx = canvas.ctx,
			pX = canvas.getPosX(data),
			pY = canvas.getPosY(data);

			switch (type) {
				case 'start':
					canvas.isDrow = true;
					ctx.beginPath();
					ctx.moveTo(pX, pY);
					break;
				case 'move':
					if (!canvas.isDrow) return;
					ctx.lineTo(pX, pY);
					ctx.stroke();
					break;
				case 'end':
					if (!canvas.isDrow) return;
					ctx.lineTo(pX, pY);
					ctx.stroke();
					ctx.closePath();
					canvas.isDrow = false;
					break;
				default :
					break;
			}
		},
		getPosX :function(data) {
			return data.x || data.clientX || data.changedTouches[0].clientX;
		},
		getPosY :function(data) {
			return data.y || data.clientY || data.changedTouches[0].clientY;
		}
	};

	var app = {
		init: function() {
			socket.init();
			$(window).on(socket.ON_SOCKET_DATA, function(e, data) {
				app.onSocketData(e, data);
			});

			canvas.init();
			canvas.element.addEventListener(EVT.start, this, false);
		},
		handleEvent : function(e) {
			var action;
			switch (e.type) {
				case EVT.start:
					action = 'start';
					// canvas.draw(EVT.start, e);
					window.addEventListener(EVT.move, this, false);
					window.addEventListener(EVT.end, this, false);
					break;
				case EVT.move:
					action = 'move';
					// canvas.draw(EVT.move, e);
					break;
				case EVT.end:
					action = 'end';
					// canvas.draw(EVT.end, e);
					window.removeEventListener(EVT.move, this, false);
					window.removeEventListener(EVT.end, this, false);
					break;
				default :
					break;
			}

			socket.sendData({
				action : action,
				x : canvas.getPosX(e),
				y : canvas.getPosY(e)
			});
		},
		onSocketData :function(e, data) {
			canvas.draw(data.action, data);
		}
	};

	app.init();

}(jQuery, window));

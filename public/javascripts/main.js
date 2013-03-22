require.config({
 	baseUrl : '../javascripts',
	shim: {
		'backbone' : {
			deps: ['jquery', 'lodash'],
			exports: 'Backbone'
		},
		'lodash' : {
			deps: [],
			exports: '_'
		}
	},

	paths: {
		jquery: 'vendor/jquery',
		backbone : 'vendor/backbone',
		lodash : 'vendor/lodash.min'
	}
});

require([
	'jquery',
	'backbone',
	'/socket.io/socket.io.js'
	], function($, backbone, io) {

		var EVT = 'ontouchend' in window.document ? {
			start : 'touchstart',
			move : 'touchmove',
			end : 'touchend'
		} : {
			start : 'mousedown',
			move : 'mousemove',
			end : 'mouseup'
		};

		/*
		// socketオブジェクト
		*/
		var socket = {
			ON_SOCKET_DATA : 'ON_SOCKET_DATA',
			ON_NEW_CONNECT : 'ON_NEW_CONNECT',
			// connectUrl : 'http://whitebord.herokuapp.com/',
			connectUrl : location.origin,
			init : function() {
				socket.id = 'id' + Math.round($.now()*Math.random());
				socket.io = io.connect(socket.connectUrl);
				socket.io.on('connect', socket.onConnected);
				socket.io.on('newconnect', socket.onNewConnected);
				socket.io.on('message', socket.onMessage);
			},
			onConnected : function(msg) {
				document.getElementById("type").innerHTML = socket.io.socket.transport.name;
				socket.io.emit('newconnect', {value : {
					sessid: socket.io.socket.transport.sessid,
					connectName : socket.io.socket.transport.name,
					socketid : socket.id
				}});
			},
			onNewConnected : function(data) {
				$(window).trigger(socket.ON_NEW_CONNECT, [data.value]);
			},
			onMessage : function(data) {
				$(window).trigger(socket.ON_SOCKET_DATA, [data.value]);
			},
			sendData : function(data) {
				data.id = socket.id;
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

		/*
		// canvasオブジェクト
		*/
		var canvas = {
			canvasId : 'canvas',
			init : function() {
				canvas.element = document.getElementById(canvas.canvasId);
				canvas.element.width = window.innerWidth;
				canvas.ctx = canvas.element.getContext("2d");
				canvas.isDrow = false;
				if (window.bitmapData !== '') {
					this.addImage();
				}
			},
			drawLine : function(fromx, fromy, tox, toy) {
				var ctx = canvas.ctx;
				ctx.moveTo(fromx, fromy);
				ctx.lineTo(tox, toy);
				ctx.stroke();
			},
			addImage: function() {
				var ctx = canvas.ctx;
				var image = new Image();
				image.onload = $.proxy(function() {
					console.log(window.bitmapData);
					console.log(ctx);
					ctx.drawImage(image, 0, 0);
				}, this);
				image.src = window.bitmapData;
			},
			getPosX :function(data) {
				return data.x || data.offsetX || data.changedTouches[0].clientX - data.changedTouches[0].target.offsetLeft;
			},
			getPosY :function(data) {
				return data.y || data.offsetY || data.changedTouches[0].clientY - data.changedTouches[0].target.offsetTop;
			},
			getDataUrl: function() {
				return canvas.element.toDataURL('image/png');
			}
		};

		/*
		// appオブジェクト
		*/
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
			},
			handleEvent : function(e) {
				var action;
				e.preventDefault();
				canvas.element.addEventListener(EVT.start, app, false);
				switch (e.type) {
					case EVT.start:
						action = 'start';
						app.isDrow = true;
						app.pastX = canvas.getPosX(e);
						app.pastY = canvas.getPosY(e);
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
						break;
					default :
						break;
				}

				if(e.type !== EVT.start) {
					canvas.drawLine(
						app.pastX,
						app.pastY,
						canvas.getPosX(e),
						canvas.getPosY(e)
					);
					app.pastX = canvas.getPosX(e);
					app.pastY = canvas.getPosY(e);
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

		app.init();
});
define(["jquery", '/socket.io/socket.io.js'], function($, io) {
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

	return socket;
});
define(["jquery"], function($) {
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

	return canvas;
});
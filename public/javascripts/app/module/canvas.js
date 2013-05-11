define(["jquery"], function($) {
	var drawParams = {
		name : "",
		type : "pencil",
		color : "",
		thickness: ""
	};
	/*
	// canvasオブジェクト
	*/
	var canvas = {
		canvasId : 'canvas',
		init : function() {
			canvas.element = document.getElementById(canvas.canvasId);
			canvas.element.width = window.innerWidth;
			canvas.element.height = window.innerHeight;
			canvas.ctx = canvas.element.getContext("2d");
			canvas.isDrow = false;
			if (window.bitmapData !== '') {
				this.addImage();
			}
			canvas.updateDrawParams();
		},
		draw: function(pathDataList) {
			var i = 0,
				len = pathDataList.length,
				paths, p, j, jLen;
			this.clear();
			for(; i < len; i++){
				paths = pathDataList[i].attributes.paths;
				j = 0;
				jLen = paths.length;
				for(; j < jLen; j++){
					p = paths[j];
					this.drawLine(p.startX, p.startY, p.endX, p.endY);
				}
			}
		},
		drawLine : function(fromx, fromy, tox, toy) {
			console.log(fromx, fromy, tox, toy);
			var ctx = canvas.ctx;
			ctx.beginPath();
			ctx.strokeStyle = drawParams.color;
			ctx.lineWidth = drawParams.thickness;
			ctx.moveTo(fromx, fromy);
			ctx.lineTo(tox, toy);
			ctx.closePath();
			ctx.stroke();
		},
		addImage: function() {
			var ctx = canvas.ctx;
			var image = new Image();
			image.onload = $.proxy(function() {
				ctx.drawImage(image, 0, 0);
			}, this);
			// image.src = window.bitmapData;
		},
		clear: function() {
			canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
		},
		undo: function(models) {
			canvas.draw(models);
		},
		redo: function(models) {
			canvas.draw(models);
		},
		getPosX :function(data) {
			return data.x || data.offsetX || data.changedTouches[0].clientX - data.changedTouches[0].target.offsetLeft;
		},
		getPosY :function(data) {
			return data.y || data.offsetY || data.changedTouches[0].clientY - data.changedTouches[0].target.offsetTop;
		},
		getDataUrl: function() {
			return canvas.element.toDataURL('image/png');
		},
		setDrawType: function(name) {
			drawParams.type = name;
			canvas.updateDrawParams();
		},
		updateDrawParams: function() {
			switch (drawParams.type) {
				case "pencil":
					drawParams.name = "pencil";
					drawParams.color = "#000";
					drawParams.thickness = 10;
					break;
				case "eraser":
					drawParams.name = "eraser";
					drawParams.color = "#fff";
					drawParams.thickness = 10;
					break;
			}
		},
		getDrawParams : function(propNAme) {
			if (propNAme === 'all') {
				return drawParams;
			}else {
				return drawParams[propNAme];
			}
		}
	};

	return canvas;
});
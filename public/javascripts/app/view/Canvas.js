define([
	"jquery",
	'app/view/View'
	], function($, View) {
	var drawParams = {
		name : "",
		type : "pencil",
		color : "",
		thickness: ""
	};

	var Canvas = View.extend({
		initialize : function(id) {
			this.el.width = window.innerWidth;
			this.el.height = window.innerHeight;

			this.ctx = this.el.getContext("2d");
			this.isDrow = false;
			if (window.bitmapData !== '') {
				this.addImage();
			}
			this.updateDrawParams();
		},
		draw: function(pathDataList) {
			var i = 0,
				len = pathDataList.length,
				paths, p, j, jLen;
			this.clear();
			for(; i < len; i++){
				console.log(pathDataList[i]);
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
			var ctx = this.ctx;
			ctx.beginPath();
			ctx.strokeStyle = drawParams.color;
			ctx.lineWidth = drawParams.thickness;
			ctx.moveTo(fromx, fromy);
			ctx.lineTo(tox, toy);
			ctx.closePath();
			ctx.stroke();
		},
		addImage: function() {
			var ctx = this.ctx;
			var image = new Image();
			image.onload = $.proxy(function() {
				ctx.drawImage(image, 0, 0);
			}, this);
			// image.src = window.bitmapData;
		},
		clear: function() {
			this.ctx.clearRect(0, 0, this.el.width, this.el.height);
		},
		undo: function(models) {
			this.draw(models);
		},
		redo: function(models) {
			this.draw(models);
		},
		getPosX :function(data) {
			return data.x || data.offsetX || data.changedTouches[0].clientX - data.changedTouches[0].target.offsetLeft;
		},
		getPosY :function(data) {
			return data.y || data.offsetY || data.changedTouches[0].clientY - data.changedTouches[0].target.offsetTop;
		},
		getDataUrl: function() {
			return this.el.toDataURL('image/png');
		},
		setDrawType: function(name) {
			drawParams.type = name;
			this.updateDrawParams();
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
	});

	return Canvas;
});
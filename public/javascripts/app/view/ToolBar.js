define([
	'jquery',
	'app/model/DrawState',
	'app/view/View',
	'app/view/PencilBtn',
	'app/view/EraserBtn',
	'app/view/ColorBtn',
	'app/view/ThicknessBtn'
	], function($, DrawState, View, PencilBtn, EraserButton, ColorButton, ThicknessButton) {
		var ToolBar = View.extend({
			initialize : function() {
				this.btnInit();
			},
			events : {
				'click .close' : 'closeToolbar'
			},
			btnInit : function() {
				var drawState = new DrawState();
				var penciBtnl = new PencilBtn({
					el : '#pencilBtn',
					model : drawState
				});
				var eraserBtn = new EraserButton({
					el : '#eraserBtn',
					model : drawState
				});
				var colorBtn = new ColorButton({
					el : '#colorBtn',
					model : drawState
				});
				var thicknessBtn = new ThicknessButton({
					el : '#thicknessBtn',
					model : drawState
				});
			},
			closeToolbar : function() {
				this.hide();
			}
		});

		return ToolBar;
});
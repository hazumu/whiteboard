define([
	'jquery',
	'app/view/ToolButton'
	], function($, ToolButton) {

		var EraserBtn = ToolButton.extend({
			initialize : function() {
				this.name = 'eraser';
				ToolButton.prototype.initialize.apply(this, arguments);
			}
		});

		return EraserBtn;
});
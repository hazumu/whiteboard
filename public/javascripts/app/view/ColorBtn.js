define([
	'jquery',
	'app/view/ToolButton'
	], function($, ToolButton) {

		var ColorBtn = ToolButton.extend({
			initialize : function() {
				this.name = 'color';
				ToolButton.prototype.initialize.apply(this, arguments);
			}
		});

		return ColorBtn;
});
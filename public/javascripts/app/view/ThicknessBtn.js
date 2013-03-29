define([
	'jquery',
	'app/view/ToolButton'
	], function($, ToolButton) {

		var ThicknessBtn = ToolButton.extend({
			initialize : function() {
				this.name = 'thickness';
				ToolButton.prototype.initialize.apply(this, arguments);
			}
		});

		return ThicknessBtn;
});
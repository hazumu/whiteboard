define([
	'jquery',
	'app/view/ToolButton'
	], function($, ToolButton) {

		var PencilBtn = ToolButton.extend({
			initialize : function() {
				this.name = 'pencil';
				ToolButton.prototype.initialize.apply(this, arguments);
			}
		});

		return PencilBtn;
});
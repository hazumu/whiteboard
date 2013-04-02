define([
	'jquery',
	'app/view/Button'
	], function($, Button) {

		var FuncTool = Button.extend({
			initialize : function(params) {
				this.name = params.name;
				this.action = params.action;
			},
			touchEndHandler: function() {
				this.changeBtnClass(false);
				this.action && this.action();
			}
		});

		return FuncTool;
});
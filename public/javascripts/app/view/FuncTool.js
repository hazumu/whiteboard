define([
	'jquery',
	'app/view/Button'
	], function($, Button) {

		var FuncTool = Button.extend({
			initialize : function(params) {
				this.name = params.name;
			}
		});

		return FuncTool;
});
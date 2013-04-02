define([
	'jquery',
	'app/model/DrawState',
	'app/view/Button'
	], function($, DrawState, Button) {

		var DrawTool = Button.extend({
			model: null,
			name : '',
			initialize : function(params) {
				var self = this;
				this.name = params.name;
				this.model.on('change', function(e) {
					self.changeDrawState(e.changed.type);
				});
				this.action = params.action;
			},
			touchEndHandler : function() {
				this.changeBtnClass(true);
				this.model.set('type', this.name);
				this.action && this.action();
			},
			changeDrawState: function(str) {
				if(this.name !== str) {
					this.changeBtnClass(false);
				}
			}
		});

		return DrawTool;
});
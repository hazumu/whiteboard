define([
	'jquery',
	'app/model/DrawState',
	'app/view/Button'
	], function($, DrawState, Button) {

		var ToolButton = Button.extend({
			model: null,
			name : '',
			initialize : function() {
				var self = this;
				this.model.on('change', function(e) {
					self.changeDrawState(e.changed.type);
				});
			},
			touchEndHandler : function() {
				this.changeBtnClass(true);
				this.model.set('type', this.name);
			},
			changeDrawState: function(str) {
				if(this.name !== str) {
					this.changeBtnClass(false);
				}
			}
		});

		return ToolButton;
});
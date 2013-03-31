define([
	'jquery',
	'app/view/View'
	], function($, View) {

		var Button = View.extend({
			name : "none",
			initialize : function() {
			},
			touchStartHandler : function() {
				this.$el.addClass(Button.CN_TOUCH_START);
			},
			changeBtnClass : function(b) {
				if (b) {
					this.$el.removeClass(Button.CN_TOUCH_START);
					this.$el.addClass(Button.CN_SELECTED);
				}else {
					this.$el.removeClass(Button.CN_TOUCH_START);
					this.$el.removeClass(Button.CN_SELECTED);
				}
			},
			touchEndHandler : function() {
				this.changeBtnClass(false);
			}
		}, {
			CN_TOUCH_START : 'btn-touched',
			CN_SELECTED : 'btn-selected'
		});

		return Button;
});
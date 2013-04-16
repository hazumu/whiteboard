define([
	'jquery',
	'app/view/View'
	], function($, View) {

		var Button = View.extend({
			name : "none",
			isDisable : false,
			initialize : function(params) {
				this.name = params.name;
				this.$el[0].instance = this;
			},
			touchStartHandler : function() {
				if(!this.isDisable) {
					this.$el.addClass(Button.CN_TOUCH_START);
				}
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
			enable: function(b) {
				this.isDisable = false;
				this.$el.removeClass(Button.CN_TOUCH_START);
				this.$el.removeClass(Button.CN_SELECTED);
				this.$el.removeClass(Button.CN_DISABLED);
			},
			disable: function(b) {
				this.isDisable = true;
				this.$el.removeClass(Button.CN_TOUCH_START);
				this.$el.removeClass(Button.CN_SELECTED);
				this.$el.addClass(Button.CN_DISABLED);
			},
			touchEndHandler : function() {
				this.changeBtnClass(false);
			},
			select : function() {
				this.changeBtnClass(true);
			},
			notSelect : function() {
				this.changeBtnClass(false);
			}
		}, {
			CN_TOUCH_START : 'btn-touched',
			CN_SELECTED : 'btn-selected',
			CN_DISABLED : 'btn-disabled'
		});

		return Button;
});
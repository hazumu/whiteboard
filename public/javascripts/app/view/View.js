define([
	'jquery',
	'lodash',
	'backbone'
	], function($, _, backbone) {

	var View = Backbone.View.extend({
		initialize : function() {

		},
		events : {
			'touchstart' : 'touchStartHandler',
			'touchmove' : 'touchMoveHandler',
			'touchend' : 'touchEndHandler'
		},
		show : function() {
			this.$el.show();
		},
		hide : function() {
			this.$el.hide();
		},
		touchStartHandler : function() {},
		touchMoveHandler : function() {},
		touchEndHandler : function() {}
	});

	return View;
});
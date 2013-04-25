define([
	'jquery',
	'app/view/View'
	], function($, View) {

	var Cursor = View.extend({
		el : '.cursor-container',
		initialize: function() {

		},
		position: function(x, y) {
			this.$el.css({
				top: y + "px",
				left: x + "px"
			});
		}
	});

	return Cursor;
});
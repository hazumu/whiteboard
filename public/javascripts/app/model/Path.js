define([
	'jquery',
	'lodash',
	'backbone'
	], function($, _, Backbone) {

	var Path = Backbone.Model.extend({
		default: {
			paths : undefined,
			color : undefined,
			thickness : undefined,
			type : undefined
		},
		initialize : function() {

		}
	});

	return Path;
});
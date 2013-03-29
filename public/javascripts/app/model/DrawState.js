define([
	'jquery',
	'lodash',
	'backbone'
	], function($, _, Backbone) {

	var DrawState = Backbone.Model.extend({
		default: {
			type : 'pencil'
		},
		initialize : function() {

		}
	});

	return DrawState;
});
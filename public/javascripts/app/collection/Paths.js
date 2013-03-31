define([
	'jquery',
	'lodash',
	'backbone',
	'app/model/Path'
	], function($, _, Backbone, Path) {

	var Paths = Backbone.Collection.extend({
		model : Path,
		initialize : function() {

		}
	});

	return Paths;
});
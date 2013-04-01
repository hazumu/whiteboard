define([
	'jquery',
	'lodash',
	'backbone',
	'app/model/Path'
	], function($, _, Backbone, Path) {

	var Paths = Backbone.Collection.extend({
		model : Path,
		counter : 0,
		initialize : function() {

		},
		add : function(obj) {
			this.counter++;
			Backbone.Collection.prototype.add.call(this, obj);
		}
	});

	return Paths;
});
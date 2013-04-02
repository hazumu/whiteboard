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
			this.on('reset', this._resetHandler.bind(this));
		},
		add : function(obj) {
			this.counter++;
			Backbone.Collection.prototype.add.call(this, obj);
		},
		_resetHandler: function() {
			this.counter = 0;
		}
	});

	return Paths;
});
define([
	'jquery',
	'lodash',
	'backbone',
	'app/model/Path'
	], function($, _, Backbone, Path) {

	var Paths = Backbone.Collection.extend({
		model : Path,
		pathHistory : [],
		initialize : function() {
			this.on('reset', this._resetHandler.bind(this));
		},
		add : function(obj) {
			Backbone.Collection.prototype.add.call(this, obj);
		},
		undo : function() {
			this.pathHistory.push(this.pop());
		},
		redo : function() {
			this.add(this.pathHistory.pop());
		},
		_resetHandler: function() {
			this.counter = 0;
		}
	});

	return Paths;
});
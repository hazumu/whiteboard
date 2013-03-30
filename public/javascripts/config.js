require.config({
 	baseUrl : '../javascripts',
	shim: {
		'backbone' : {
			deps: ['jquery', 'lodash'],
			exports: 'Backbone'
		},
		'lodash' : {
			deps: [],
			exports: '_'
		}
	},
	paths: {
		jquery: 'vendor/jquery',
		backbone : 'vendor/backbone',
		lodash : 'vendor/lodash.min'
	}
});

require(['app/main'], function(app) {app.init();});
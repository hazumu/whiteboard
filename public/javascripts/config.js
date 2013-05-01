require.config({
 	baseUrl : '../../javascripts',
	shim: {
		'backbone' : {
			deps: ['jquery', 'lodash'],
			exports: 'Backbone'
		},
		'lodash' : {
			deps: [],
			exports: '_'
		},
		'eventdispatcher' : {
			deps: [],
			exports: 'createjs.EventDispatcher'
		}
	},
	paths: {
		jquery: 'vendor/jquery',
		backbone : 'vendor/backbone',
		lodash : 'vendor/lodash.min',
		eventdispatcher : 'vendor/event_dispatcher'
	}
});

var pageId = location.href.split('/').pop();
if(pageId === 'pen'){
	require(['app/main'], function(app) {app.init();});
}else if (pageId === 'whiteboard') {
	require(['app/main_whiteboard'], function(app) {app.init();});
}

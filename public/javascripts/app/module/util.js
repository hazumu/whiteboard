define(["jquery"], function($) {
	var EVT = 'ontouchend' in window.document ? {
		start : 'touchstart',
		move : 'touchmove',
		end : 'touchend'
	} : {
		start : 'mousedown',
		move : 'mousemove',
		end : 'mouseup'
	};
	var util = {
		EVT : EVT
	};

	return util;
});
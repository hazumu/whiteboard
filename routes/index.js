/*
 * GET home page.
 */
exports.index = function(req, res){
	// model
	var RoomProvider = require('../models/roomprovider').RoomProvider;
	var userName = req.session.passport.user.username;

	var list = RoomProvider.findAll(function(req, post){
		res.render('index', {
			title: 'ホワイトボードくん',
			userName: userName,
			lists: post
		});
	});
};

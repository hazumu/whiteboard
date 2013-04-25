/*
 * GET home page.
 */
exports.index = function(req, res){
	// model
	var RoomProvider = require('../models/roomprovider').RoomProvider;
	var userName = req.session.passport.user.username;
	var userImg  = req.session.passport.user._json.profile_image_url;

	var list = RoomProvider.findAll(function(req, post){
		res.render('index', {
			title: 'ホワイトボードくん',
			userName: userName,
			userImg: userImg,
			lists: post
		});
	});
};

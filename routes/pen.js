/*
 * GET root page.
 */
exports.pen = function(req, res){
	// model
	var RoomProvider = require('../models/roomprovider').RoomProvider;
	var userName = req.session.passport.user.username;
	var userImg  = req.session.passport.user._json.profile_image_url;

	// コールバックの第二引数のネーミングが謎
	var list = RoomProvider.findById(req.param('id'), function(err, contact){
		if (err) throw err;
		console.log(contact);
		res.render('pen', {
			title: contact.name,
			bitmapData: contact.bitmapData,
			id: req.param('id'),
			userName: userName,
			userImg: userImg
		});
	});
};


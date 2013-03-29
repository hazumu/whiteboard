/*
 * GET root page.
 */
exports.room = function(req, res){
	// model
	var RoomProvider = require('../models/roomprovider').RoomProvider;

	// コールバックの第二引数のネーミングが謎
	var list = RoomProvider.findById(req.param('id'), function(err, contact){
		if (err) throw err;
		console.log(contact);
		res.render('room', {
			title: contact.name,
			bitmapData: contact.bitmapData,
			id: req.param('id'),
		});
	});
};


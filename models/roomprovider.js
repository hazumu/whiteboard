var mongoose = require('mongoose'),
		uri = process.env.MONGOHQ_URL || 'mongodb://localhost/test';
mongoose.connect(uri);

var Schema = mongoose.Schema,
		ObjectId = Schema.Objectid;

var Post = new Schema({
		name:       String,
		bitmapData: String,
		create_at:  Date
});

mongoose.model('Post', Post);
var Post = mongoose.model('Post');

RoomProvider = function(){};

RoomProvider.prototype.findAll = function(callback) {
	Post.find({}, function(err, posts) {
					callback(null, posts)
			});
};

RoomProvider.prototype.findById = function(id, callback) {
	Post.findById(id, function(err, posts) {
					callback(null, posts)
			});
};

RoomProvider.prototype.save = function(params, callback) {
		var post = new Post({
					name:       params['name'],
					bitmapData: params['bitmapData'],
					create_at:  new Date().toLocaleString().toString()
				});
				post.save(function(err) {
					 callback();
				});
};

RoomProvider.prototype.update = function(params, callback) {
		console.log('do update');
		console.log('id', params['id']);
		console.log('id', params['data']);

		Post.update({_id:params['id']}, 
			{$set:{bitmapData: params['data']}}, 
			{upsert: false, multi: true},
			function(err, posts) {
				console.log('did update');
				callback(null, posts);
		});
};

exports.RoomProvider = new RoomProvider();

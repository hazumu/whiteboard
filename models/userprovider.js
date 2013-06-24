var mongoose = require('mongoose');
	//uri = process.env.MONGOHQ_URL || 'mongodb://localhost/test';
// singleton臭い。環境によってはエラー一回connectionをったあとに再度コネクションをはるとエラーになる。
// local ok
// heroku ok 
// nodejitsu ng
//mongoose.connect('mongodb://nodejitsu_hazumu:etfmib9vaeejavdvo319ernsh9@ds043937.mongolab.com:43937/nodejitsu_hazumu_nodejitsudb6713823513');

var Schema = mongoose.Schema,
	ObjectId = Schema.Objectid;

var User = new Schema({
	uid:           String,
	user_name:     String,
	access_token:  String,
	access_secret: String,
	create_at:     Date
});

mongoose.model('User', User);
var User = mongoose.model('User');

UserProvider = function(){};

UserProvider.prototype.findAll = function(callback) {
	User.find({}, function(err, users) {
		callback(null, users)
	});
};

UserProvider.prototype.findById = function(id, callback) {
	User.findById(id, function(err, users) {
		callback(null, users)
	});
};

UserProvider.prototype.findByUserId = function(uid, callback) {
	User.findById(uid, function(err, users) {
		callback(null, users)
	});
};

UserProvider.prototype.save = function(params) {
	var user = new User({
		uid:           params['uid'],
		user_name:     params['user_name'],
		access_token:  params['access_token'],
		access_secret: params['access_secret'],
		create_at:    new Date().toLocaleString().toString()
	});
	user.save();
};

UserProvider.prototype.update = function(params, callback) {
	User.update({uid:params['uid']}, 
		{$set:
			{
				user_name: params['user_name'],
				access_token: params['access_token']
			}
		}, 
		{upsert: false, multi: true},
		function(err, users) {
			console.log('did user update');
			callback(null, users);
	});
};

exports.UserProvider = new UserProvider();

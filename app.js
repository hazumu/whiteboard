var express          = require('express'),
	mongoose         = require('mongoose'),
	routes           = require('./routes'),
	routesRoom       = require('./routes/room'),
	routesPen        = require('./routes/pen'),
	routesWhiteboard = require('./routes/whiteboard'),
	http             = require('http'),
	url              = require('url'),
	path             = require('path'),
	socketIO = require('socket.io'),
	passport         = require('passport'),
	twitterStrategy  = require('passport-twitter').Strategy,
	app              = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());                  // session使うためにパーサーを有効に
	app.use(express.session({secret: 'hogesecret'})); // session有効 引数の内容を調査
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);                              // sessionとinitializeの後じゃないと動かない
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

// セッションに保持
passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj, done){
	done(null, obj);
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

// model
var RoomProvider = require('./models/roomprovider').RoomProvider;
var UserProvider = require('./models/userprovider').UserProvider;

// index
app.get('/', ensureAuthenticated, routes.index);

// ルーム画面
app.get('/room/:id', ensureAuthenticated, routesRoom.room);

// ルーム作成
app.post('/room_create', function(req, res, next) {
	// ルーム名を取得
	var name = req.body.name
	RoomProvider.save({
		name: name,
		bitmapData: ''
	}, function() {
		// 保存終了したらリダイレクト
		res.redirect('/');
	});
});

// 基本的なselect,insert,update,deleteを実装できたら素敵
// ルーム削除
app.post('/room_delete', function(req, res, next) {});

// ルーム編集
app.post('/room_edit', function(req, res, next) {});

// ルームsave
app.post('/room_save', function(req, res, next) {
	RoomProvider.update(req.body, function() {
		res.redirect('/');
	});
});

// ペン画面
// ToDo:一旦削除
// app.get('/room/:id/pen', ensureAuthenticated, routesPen.pen);
app.get('/room/:id/pen', routesPen.pen);

// ホワイトボード画面
app.get('/room/:id/whiteboard', routesWhiteboard.whiteboard);

// セッション
app.get('/login', function(req, res) {
	res.render('login');
})

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

// クライアントの接続を待つ(IPアドレスとポート番号を結びつけます)
var io = socketIO.listen(server);
io.configure(function () {
	io.set('authorization', function (handshake, callback) {

		var id = handshake.query.id;

		if (!io.namespaces.hasOwnProperty('/whiteboard/' + id)) {
			console.log('no namespace', 'namesace', id);

			var room = io.of('/whiteboard/' + id);
			room.on('connection', function (socket) {
				console.log('connnection');

				socket.on('newconnect', function(data, req) {
					console.log('new');
					io.sockets.emit('newconnect', { value: data.value });
				});

				// メッセージを受けたときの処理
				socket.on('message', function(data) {
					// つながっているクライアント全員に送信
					console.log(data);
					// to
					socket.broadcast.emit('message', { value: data.value });
				});

				// クライアントが切断したときの処理
				socket.on('disconnect', function(){
					console.log("disconnect");
				});
			});

		// id がある
		} else {
			console.log('has namespace', 'namesace', id);

			io.of('/whiteboard/' + id).on('connection', function (socket) {
				console.log('has id');

				socket.on('newconnect', function(data, req) {
					io.sockets.emit('newconnect', { value: data.value });
				});

				// メッセージを受けたときの処理
				socket.on('message', function(data) {
					// つながっているクライアント全員に送信
					console.log(data);
					// to
					socket.broadcast.emit('message', { value: data.value });
				});

				// クライアントが切断したときの処理
				socket.on('disconnect', function(){
					console.log("disconnect");
				});
			});
		}

		callback(null, true);
	});
});

// クライアントが接続してきたときの処理
/*
});
*/

// twitter認証
var TWITTER_CONSUMER_KEY = "jUFkxa7JCwObA1gLn2d1cA";
var TWITTER_CONSUMER_SECRET = "Kitndv0bBmHyZjqt9BdEeuIsPt8Q8gi51CWGRrHP54";

passport.use(new twitterStrategy({
		consumerKey: TWITTER_CONSUMER_KEY,
		consumerSecret: TWITTER_CONSUMER_SECRET,
		// ToDo: herokuのurlに直したい
		callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
		passport.session.accessToken = token;
		passport.session.profile = profile;
		process.nextTick(function () {
			// ユーザー情報をローカルに保存する
			UserProvider.save({
				uid:           profile.id,
				user_name:     profile.username,
				access_token:  token,
				access_secret: tokenSecret
			});
			return done(null, profile);
	});
}));

// ユーザーからリクエスト
app.get("/auth/twitter", passport.authenticate('twitter'));

// Twitterからcallbackうけるルート
app.get("/auth/twitter/callback", passport.authenticate('twitter', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}

var express  = require('express'),
		mongoose = require('mongoose'),
		routesIndex     = require('./routes/index'),
		routesRoom      = require('./routes/room'),
		http            = require('http'),
		path            = require('path'),
		passport        = require('passport'),
		twitterStrategy = require('passport-twitter').Strategy,
		app             = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

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

// index
app.get('/', routesIndex.index);

// ルーム画面
app.get('/room/:id', routesRoom.room);

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
app.post('/room_delete', function(req, res, next) {
});

// ルーム編集
app.post('/room_edit', function(req, res, next) {
});

// ルームsave
app.post('/room_save', function(req, res, next) {
	console.log('res',req.body);
	RoomProvider.update(req.body, function() {
		res.redirect('/');
	});

	// ルーム名を取得
	/*
	var name = req.body.name
	RoomProvider.save({
		name: name,
		bitmapData: ''
	}, function() {
		// 保存終了したらリダイレクト
		res.redirect('/');
	});
	*/
});


server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

// add start
var socketIO = require('socket.io');
// クライアントの接続を待つ(IPアドレスとポート番号を結びつけます)
var io = socketIO.listen(server);

// クライアントが接続してきたときの処理
io.sockets.on('connection', function(socket) {
	console.log("connection");
	// メッセージを受けたときの処理
	socket.on('message', function(data) {
		// つながっているクライアント全員に送信
		console.log("message");
		io.sockets.emit('message', { value: data.value });
	});
	
	// クライアントが切断したときの処理
	socket.on('disconnect', function(){
		console.log("disconnect");
	});
});


// ここからtwitter認証
var TWITTER_CONSUMER_KEY = "jUFkxa7JCwObA1gLn2d1cA";
var TWITTER_CONSUMER_SECRET = "Kitndv0bBmHyZjqt9BdEeuIsPt8Q8gi51CWGRrHP54";

console.log(twitterStrategy);
passport.use(new twitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    passport.session.accessToken = token;
    passport.session.profile = profile;
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.get('/account/twitter', twitterEnsureAuthenticated, routes.account);

app.get('/login/twitter', routes.login_facebook);

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){}
);

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login/twitter' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout/twitter', function(req, res){
  req.logout();
  res.redirect('/');
});

function twitterEnsureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login/twitter');
};

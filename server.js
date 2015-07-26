"use strict";

// Dependencies
var http = require('http');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var serveStatic = require('serve-static');
var session = require('cookie-session');
var express = require('express');
var app = express();
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var gravatar = require('nodejs-gravatar');
var moment = require('moment');
var User = require('./models/user');
var Post = require('./models/post');
var Comment = require('./models/comment');
var Guest = require('./models/guest');
var Primus = require('./lib/primus');
var handleErrors = require('./lib/errorHandler');
var die = require('./lib/die');
var niceErr = require('nice-error');
var ENV = process.env.NODE_ENV || 'development';

// view setup
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

/**************************/
// view helpers
/**************************/
// can be referenced directly in ejs, show gravatar image
app.locals.getGravatarImage = gravatar.imageUrl.bind(gravatar);
// A lightweight javascript date library for parsing, validating, manipulating, and formatting dates.
// for example : moment(post.createdAt).fromNow()
app.locals.moment = moment;


/**************************/
// express middleware
/**************************/

// specify server static folder
app.use(serveStatic(__dirname + '/public'));
// request log
if (ENV === 'development') {
  //app.use(morgan('dev'));
  app.use(morgan('dev'));
}
// body parser
app.use(bodyParser());
// simulate PUT to POST
app.use(methodOverride());
// cookie-session
app.use(session({
  keys: ['asss', 'b']
}));


app.use(passport.initialize());
app.use(passport.session());

// flash message
app.use(flash());

// make models accessible inside route handlers
app.use(function(req, res, next) {
  req.User = User;
  req.Post = Post;
  req.Comment = Comment;
  // function used to broadcast a msg to all connected peers
  req.broadcast = broadcast;

  next();
});

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**************************/
// routing
/**************************/

var routes = require('./routes/index');

app.get('/', routes.posts.index);
app.get('/today', routes.posts.today);
app.get('/login', routes.session.new);
app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login?unsuccessful=1'
}), routes.session.create);
app.del('/logout', routes.session.destroy);
app.get('/register', routes.users.new);
app.post('/register', routes.users.create);

//post
app.get('/posts', routes.posts.new);
app.post('/posts', routes.posts.create);
// think up_vote and down_vote as resources
app.post('/posts/:postid/up_vote',routes.posts.voteUp);
app.post('/posts/:postid/down_vote',routes.posts.voteDown);
// comment
app.get('/posts/:postid/comments', routes.comments.show);
app.get('/posts/:postid/newcomment', routes.comments.new);
app.post('/comments', routes.users.ensureAuthenticated, routes.comments.create);



/**************************/
// error handling
/**************************/


// reuse previously created error handler
if (ENV === 'development') {
  app.use(handleErrors);
} else if (ENV === 'production') {
  app.use(function(err, req, res, next) {
    err.timestamp = Date.now();
    console.error(niceErr(err));

    res.status(500).send('500 - Internal Server Error');
  });
}


/**************************/
// mongoo db
/**************************/


// mongoose
mongoose.connect('mongodb://localhost/WallApp', function(err) {
  if (err) {
    err.message = 'Failed to connect to MongoDB database \n' + err.message;
    die(err);
  }
});

/**************************/
// start listening
/**************************/



process.on('uncaughtException', die);

var server = require('http').createServer(app);
var broadcast = Primus(server);

server.listen(3000);
console.log('server up on port %s', 3000);

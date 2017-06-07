require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));

// view engine
app.set('view engine', 'ejs')

// db setup
var url = process.env.URL;
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
mongoose.Promise = global.Promise;
mongoose.connect(url, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // Wait for the database connection to establish, then start the app.
});

// passport setup
global.myvar = 0;
global.currentuser = "";
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
  res.redirect('/');
  global.myvar = 1;
  global.currentuser = req.user.google.email;
});
app.get('/logout', function(req,res){
  /*req.session.destroy(function (err) {
    res.redirect('/');
  })*/
  req.logout()
  res.redirect('/')
  global.myvar = 0;
  global.currentuser = "";
})

// routes setup
var index = require('./routes/index');
var createPoll = require('./routes/createPoll');
var polls = require('./routes/polls');
var myPolls = require('./routes/myPolls');
app.use('/', index, createPoll);
app.use('/createpoll', createPoll);
app.use('/polls', polls);
app.use('/mypolls', myPolls);

// port
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is working")
})

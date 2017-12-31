var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var request = require('request');  //  For api request

// For authentication
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user.js');


//mongoose.connect('mongodb://localhost/coin_tracker'); // database
// mongoose.connect('mongodb://alexpich:x2u53xcoffee@ds135747.mlab.com:35747/coin_tracker'); 
var url = process.env.DATABASEURL || 'mongodb://localhost/coin_tracker';
mongoose.connect(url); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); // required to get stylesheets in header.ejs to work
app.set('view engine', 'ejs');

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "secret test",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

// API request
app.get('/', function(req, res){
    request('https://api.coinmarketcap.com/v1/ticker/?limit=50', function(error, response, body){
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            res.render('showcoins', {data: data, currentUser: req.user});
        }
    });
});

// ===========
// AUTH ROUTES
// ===========

// show register form
app.get('/register', function(req, res){
    res.render('register');
});

// handle sign up logic
app.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        });
    });
});

// show login form
app.get('/login', function(req, res){
    res.render('login');
});

// handling login logic
app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/',
        failureRedirect: '/login'
    }), function(req, res){
    
});

//logout route
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server started.');
})
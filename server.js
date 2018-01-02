var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// For authentication
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user.js');

var authRoutes = require('./routes/auth');

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

app.use(authRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server started.');
})
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var request = require('request');  //  For api request

// INDEX - show all coins - API request
router.get('/', function(req, res){
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
router.get('/register', function(req, res){
    res.render('register');
});

// handle sign up logic
router.post('/register', function(req, res){
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
router.get('/login', function(req, res){
    res.render('login');
});

// handling login logic
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/',
        failureRedirect: '/login'
    }), function(req, res){
    
});

//logout route
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


module.exports = router;
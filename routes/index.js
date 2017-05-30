var express = require('express');
var passport = require('passport');
var router = express.Router();
var Poll = require('../models/polls');
var User = require('../models/user');

var app = express();




router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/mypolls/:userpoll', isLoggedIn, function(req, res) {
   var allQuestions = [];
   var allPollsId = [];
    
   Poll.find({ 'polls.userid': req.params.userpoll }, function (err, data) {
       if(err) {
           return res.send("Error reading database");
       } else {
           for (i = 0; i < data.length; i++) {
             allQuestions[i] = data[i].polls.question;
             allPollsId[i] = data[i]._id;
           }
       }
       
       res.render('mypoll.ejs', { question: allQuestions, pollid: allPollsId });        
   });

});

router.get('/allpolls/:specificpoll', isLoggedIn, function(req, res) {
   var questionTitle = "";
   var allOptions = [];
   var id = req.params.id;
    
   Poll.findOne({ '_id': req.params.specificpoll }, function (err, data) {
       if(err) {
           return res.send("Error reading database");
       } else {
          questionTitle = data.polls.question;
          for (i = 0; i < data.polls.options.length; i++) {
             allOptions[i] = data.polls.options[i];
           }
       }
    
      res.render('specificpoll.ejs', { title: questionTitle, options: allOptions });      
   });

});











router.get('/createpoll', isLoggedIn, function(req, res) {
  res.render('createpoll.ejs', { user: req.user });
});

router.post('/createpoll', isLoggedIn, function(req, res) {
        var userpoll = req.user;
        var splitedOptions = req.body.options.split('/');
        
    
        var newPoll = new Poll();
        newPoll.polls.question = req.body.question;
        for (i = 0; i < splitedOptions.length; i++) {
          newPoll.polls.options.push({ 'title': splitedOptions[i] });  
        }
        
        newPoll.polls.creationDate = new Date();
        newPoll.polls.userid = userpoll._id;
    
          newPoll.save(function(err) {
          if(err) {
            throw err;
          } else {
            res.redirect('/login');           
          }
     });     
});


router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

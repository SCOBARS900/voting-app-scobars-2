var express = require('express');
var passport = require('passport');
var router = express.Router();
var Poll = require('../models/polls');
var User = require('../models/user');

var app = express();




router.get('/', function(req, res, next) {
  var allQuestions = [];
   var allPollsId = [];
    
   Poll.find({ }, function (err, data) {
       if(err) {
           return res.send("Error reading database");
       } else {
           for (i = 0; i < data.length; i++) {
             allQuestions[i] = data[i].polls.question;
             allPollsId[i] = data[i]._id;
           }
       }
       
       res.render('index.ejs', { question: allQuestions, pollid: allPollsId });        
   });

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
            res.redirect('/allpolls');           
          }
     });     
});

router.get('/mypolls', isLoggedIn, function(req, res) {
    var currentUser = req.user;
    var userLink = "mypolls/" + currentUser._id; 
    res.redirect(userLink);
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

router.get('/allpolls', function(req, res) {
   var allQuestions = [];
   var allPollsId = [];
    
   Poll.find({ }, function (err, data) {
       if(err) {
           return res.send("Error reading database");
       } else {
           for (i = 0; i < data.length; i++) {
             allQuestions[i] = data[i].polls.question;
             allPollsId[i] = data[i]._id;
           }
       }
       
       res.render('allpoll.ejs', { question: allQuestions, pollid: allPollsId });        
   });

});

router.get('/allpolls/:specificpoll', function(req, res) {
   var questionTitle = "";
   var allOptions = [];
   ipU = req.ip;
   currentPollId = req.params.specificpoll;
   pollCreatorId = "";
   optionsIdArray = [];
   allVotesNumber = [];
   allVotesTitle = [];
   var alreadyVote = false;
    
    if (req.user != undefined) {
        currentUserId = req.user._id;
    } else {
        currentUserId = "unauthenticate";
    }
    
   Poll.findOne({ '_id': currentPollId }, function (err, data) {
       if(err) {
           return res.send("Error reading database");
       } else {
          questionTitle = data.polls.question;
          pollCreatorId = data.polls.userid;
           
          for (i = 0; i < data.polls.options.length; i++) {
             allOptions[i] = data.polls.options[i];
             optionsIdArray[i] =  data.polls.options[i]._id;
             allVotesNumber[i] = data.polls.options[i].votes;
             allVotesTitle[i] = data.polls.options[i].title; 
           }
           
          
           if (data.polls.voteUsers.length > 0) {
           for (z = 0; z < data.polls.voteUsers.length; z++) {
               if (data.polls.voteUsers[z].voteUserIp == ipU) {
                  alreadyVote = true; 
               }    
           }
           }
           
       }
    
       
      res.render('specificpoll.ejs', { title: questionTitle, options: allOptions, userid: currentUserId, pollcreator: pollCreatorId, optionsid: optionsIdArray, alreadyvote: alreadyVote, votesnumber: allVotesNumber, votestitle: allVotesTitle });      
   });

});




router.post('/voteop', function(req, res) {
   var optionID = req.body.polloutput; 
   var linkSpecificPoll = '/allpolls/' + currentPollId;
   var alreadyVote = false;
   
   var newVoteUserArray = [{
       voteUserIp: ipU,
       voteUserId: currentUserId,
       voteUserDate: new Date()
    }];
    
   Poll.findOne({ '_id': currentPollId }, function (err, data) {
       if(err) {
           return res.send("Error reading database");
       } else {
           if (data.polls.voteUsers.length > 0) {
           for (z = 0; z < data.polls.voteUsers.length; z++) {
               if (data.polls.voteUsers[z].voteUserIp == ipU) {
                  alreadyVote = true;
               }   
           }
   
           }
           
           if (!alreadyVote) {
               data.polls.voteUsers.push(newVoteUserArray[0]);
               for (i = 0; i < data.polls.options.length; i++) {
                 if (data.polls.options[i]._id == optionID) {
                     data.polls.options[i].votes += 1;
                 }
                 
              }
           }
           
           
           data.save(function(err) {
                 if (err) {
                  throw err;
                 } else {
                 res.redirect(linkSpecificPoll);
                 }
           });  
         
       }
        
});
    
});



router.post('/insertop', isLoggedIn, function(req, res) {
   
   var newOption = req.body.newOption;
   var linkSpecificPoll = '/allpolls/' + currentPollId;
    
   var newOptionArray = [{
        title: newOption,
    }];
    
    Poll.findOne({ '_id': currentPollId }, function (err, data) {
       if(err) {
           throw err;
       } else {
          data.polls.options.push(newOptionArray[0]);
          data.save(function(err) {
            if (err) {
                throw err;
            } else {
                res.redirect(linkSpecificPoll);
            }
        });
       }
        
    });
  
});


router.post('/deletepoll', isLoggedIn, function(req, res) {
    
    Poll.remove({ '_id': currentPollId }, function (err, data) {
       if(err) {
           throw err;
       } else {
           res.redirect('/mypolls');
       }
        
    });
    
  
});









router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/mypolls',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/mypolls',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/mypolls',
  failureRedirect: '/',
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/mypolls',
  failureRedirect: '/',
}));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/mypolls',
  failureRedirect: '/',
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

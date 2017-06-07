var express = require('express');
var router = express.Router();
var Poll = require('../models/poll.js');

router.get('/', function(req,res) {
  if(req.user) {
    Poll.find({ askedByEmail: req.user.google.email }).sort({'createdAt': -1}).exec(function(err,polls){
      return res.render('myPolls', {
        thesePolls: polls
      })
    })
  }



  /*if(req.user) {
    res.render('myPolls');
  } else {
    res.render('index', {
      alert: '<div class="alertbox d-flex align-items-center justify-content-center bg-danger text-white">Log in to view your polls!</div>'
    });
  }*/
})

module.exports = router;

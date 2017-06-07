var express = require('express');
var router = express.Router();
var Poll = require('../models/poll.js')

router.get('/', function(req,res) {
  //.render('createPoll');
  if(req.user) {
    res.render('createPoll');
    console.log('you are logged in')
  } else {
    res.render('index', {
      alert: '<div class="alertbox d-flex align-items-center justify-content-center bg-danger text-white" style="width: 50vh;height: 5vh;border-radius: 5px;margin: 0 auto;">Log in to create poll!</div>'
    });
  }

})

router.post('/submit', function(req,res) {
  console.log(req.body);
  console.log(req.user.google.name);

  var keys = Object.keys(req.body)
  var optionArr = [];
  for(var i=1;i<keys.length;i++) {
    optionArr.push({
      option: req.body[keys[i]],
      count: 0
    })
  }

  var newPoll = new Poll({
    question: req.body.Question,
    options: optionArr,
    askedBy: req.user.google.name,
    askedByEmail: req.user.google.email
  })

  newPoll.save(function(err) {
    if(err) throw err;
    res.redirect('polls')
    console.log("new poll added")
  })
})

module.exports = router;

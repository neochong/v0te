var express = require('express');
var router = express.Router();
var Poll = require('../models/poll.js');

router.get('/', function(req,res) {
  Poll.find({}).sort({'createdAt': -1}).exec(function(err,polls){
    return res.render('polls', {
      allPolls: polls
    })
  })
})

router.get('/:pollId', function(req,res) {
  var { pollId } = req.params;

  Poll.findById(pollId, function(err,poll) {
    if(!poll) {
      return res.json({
        Error: 'Poll cannot be found'
      })
    }
    return res.render('eachPoll', {
      thisPoll: poll,
      alert: ''
    })
  })
})

router.post('/:pollId', function(req,res) {
  if(req.body.form_type === "vote") {
//vote existing options
    var pollId = req.params.pollId;
    var optionId = req.body.optionId;
    var count = req.body.count;
    var option = req.body.option;
    var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    count++;

    Poll.findOne({'_id': pollId, 'votedIp.ip': ipAddress}, function(err,pollIp){
      if(err) return res.send('ip does not work')
      if(!pollIp) {
        Poll.update({'_id': pollId, 'options._id': optionId}, {'$set': {
          'options.$.count': count, 'votedIp.$.ip': ipAddress
        }}, function(err) {
          if(err) return res.send('does not work');
          return res.redirect('back');
        })
      } else {
        return res.json({
          Error: 'You can only vote once per poll!'
        })
      }
    })


  } else if(req.body.form_type === "add"){
// add new option
    if(req.user) {
      var pollId = req.params.pollId;
      var newOption = req.body.newOption;

      Poll.update({'_id': pollId}, {$push: {
        'options': {option: newOption, count: 0}}},
        {safe:true, upsert:true, new:true},
        function(err) {
          if(err) res.send('cant add option');
          return res.redirect('back')
        }
      )
    } else {
      res.render('index', {
        alert: '<div class="alertbox d-flex align-items-center justify-content-center bg-danger text-white" style="width: 50vh;height: 5vh;border-radius: 5px;margin: 0 auto;">Log in to add options!</div>'
      })
    }
  } else {
//delete poll
    var pollId = req.params.pollId

    if(req.body.confirm === "YES") {
      Poll.remove({'_id': pollId}, function(err) {
        if(err) return res.send('cannot remove')
        res.redirect('/mypolls')
        console.log('works')
      })
    } else {
      return res.redirect('back')
    }

  }


})

module.exports = router;

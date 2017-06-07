var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
  alert = ""

  res.render('index')
})

module.exports = router;

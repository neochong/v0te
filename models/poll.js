var mongoose = require('mongoose');

var pollSchema = mongoose.Schema({
  question: String,
  options: [
    {
      option: String,
      count: Number
    }
  ],
  askedBy: String,
  askedByEmail: String,
  votedIp: [
    {
      ip: String
    }
  ]
}, {timestamps: true});

module.exports = mongoose.model('poll', pollSchema)

var mongoose = require('mongoose');

var UsageSchema = new mongoose.Schema({
  usage: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Usage', UsageSchema);

var mongoose = require('mongoose');

var FunctionsSchema = new mongoose.Schema({
  functions: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Functions', FunctionsSchema);

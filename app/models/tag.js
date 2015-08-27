var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    "default": Date.now
  }
});

module.exports = mongoose.model('Tag', TagSchema);

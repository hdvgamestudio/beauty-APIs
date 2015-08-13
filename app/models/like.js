var mongoose = require('mongoose');

var LikeSchema = new mongoose.Schema({
  cosmetic_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  }
});

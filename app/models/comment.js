var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  cosmetic_id: {
    type: String,
    required: true
  },
  parent_id: String,
  posted: {
    type: Date,
    required: true
  },
  user: {user_id: String, username: String, user_icon_url: String},
  message: String,
  likes: []
});

module.exports = mongoose.model('Comment', CommentSchema);

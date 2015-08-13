var mongoose = require('mongoose');
var Schema = mongoose.Schema

var CommentSchema = new Schema({
  cosmetic: {
    type: String,
    required: true,
    ref: Schema.ObjectId
  },
  parent_id: Schema.ObjectId,
  posted_at: {
    type: Date,
    required: true
  },
  user: {
    user_id: {
      type: Schema.ObjectId,
      required: true,
    },
    username: {
      type: String,
      required: true
    }
    user_icon_url: String
  },
  message: String,
  likes: {
    count: {
      type: Number
    },
    users: [{
      user_id: {
        type: Schema.ObjectId,
        required: true,
      },
      username: {
        type: String,
        required: true
      }
      user_icon_url: String
    }]
  }
});

module.exports = mongoose.model('Comment', CommentSchema);

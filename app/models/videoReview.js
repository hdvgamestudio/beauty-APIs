var mongoose = require('mongoose');
var Schema = mongoose.Schema

var VideoReviewSchema = new Schema({
  cosmetic: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Cosmetic'
  },
  description: {
    type: String
  },
  url: {
    type: String
  }
});

module.exports = mongoose.model('VideoReview', VideoReview);

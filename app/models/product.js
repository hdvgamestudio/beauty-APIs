var mongoose = require('mongoose');
var Schema = mongoose.Schema

var RateSchema = new Schema({
  value: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5]
  },
  user_id: {
    type: Schema.ObjectId
  }
});

var ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: String,
  created_at: {
    type: Date,
    "default": Date.now
  },
  modified_at: Date,
  information: String,
  image_url: String,
  classifications: [{
    type: Schema.ObjectId,
    ref: 'Classification'
  }],
  company: {
    name: String,
    country: String,
    website: String,
    founded: Date
  },
  country: String,
  distributors: [{
    type: Schema.ObjectId,
    ref: 'Distributor'
  }],
  metadata: {
    rates: [RateSchema],
    rate: {type: Number, enum: [0, 1, 2, 3, 4, 5]},
    comments: Number
  },
  tags: [{
    type: String
  }]
});

ProductSchema.pre('save', function(next) {
  var product = this;
  product.modified_at = new Date();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);

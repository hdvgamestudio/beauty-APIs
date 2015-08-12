var moongose = require('mongoose');

var CosmeticSchema = new mongoose.Schema({
  cosmetic_name: {
    type: String,
    required: true
  },
  code: String,
  created_at: Date,
  updated_at: Date,
  information: String,
  image_url: String,
  category_id: String,
  company: {company_name: String, country: String, website: String, founded: Date}
  country: String,
  distributors: [],
  metadata: {likes: Number, comments: Number, views: Number, rate: {type: Number, enum: [0, 1, 2, 3, 4, 5]}}
});

module.exports = monngoose.model('Cosmetic', CosmeticSchema);

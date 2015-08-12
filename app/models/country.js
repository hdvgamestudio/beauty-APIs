var mongoose = require('mongoose');

var CountrySchema = new mongoose.Schema({
  country_name: {
    type: String,
    required: true
  },
  code: String,
  flag_url: String
});

module.exports = mongoose.model('Country', CountrySchema);


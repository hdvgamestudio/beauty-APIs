var mongoose = require('mongoose');

var DistributorSchema = new mongoose.Schema({
  distirbutor_name: {
    type: String,
    required: true
  },
  created_at: Date,
  updated_at: Date,
  information: String,
  website: String,
  phone_number: String,
  email_address: String,
  logo_url: String,
  shops: []
});

module.exports = mongoose.model('Distributor', DistributorSchema);

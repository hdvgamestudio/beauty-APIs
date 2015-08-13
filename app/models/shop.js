var mongoose = require('mongoose');

var ShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  email_address: String,
  phone_number: String,
  GPS: {longitude: Number, latitude: Number}
});

module.exports = mongoose.model('Shop', ShopSchema);

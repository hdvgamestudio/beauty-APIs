var mongoose = require('mongoose');

var ShopSchema = new mongoose.Schema({
  shop_name: {
    type: String,
    required: true
  },
  address: String,
  phone_number: String,
  GPS: {longitude: Number, latitude: Number}
});

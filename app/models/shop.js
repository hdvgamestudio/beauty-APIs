var mongoose = require('mongoose');

var ShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  email: {
		type		 : String,
		validate : /^\w+@\w+.\w+$/
	},
  phone: {
		type     : String,
		validate : /^\d+$/
	},
  GPS: {longitude: Number, latitude: Number}
});

module.exports = mongoose.model('Shop', ShopSchema);

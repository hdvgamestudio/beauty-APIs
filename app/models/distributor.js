var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DistributorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    "default": Date.now
  },
  modified_at: Date,
  information: String,
  website: String,
  phone: {
    type     : String,
    validate : /^\d+$/
  },
  email: {
    type     : String,
    validate : /^\w[\w.]+@\w+.\w+$/
  },
  logo_url: String,
  shops: [{
    type: Schema.ObjectId,
    ref: 'Shop'
  }]
});

module.exports = mongoose.model('Distributor', DistributorSchema);

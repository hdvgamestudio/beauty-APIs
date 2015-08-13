var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required:true
  },
  sex: { type: String, enum: ["M","F"] },
  birthday: Date,
  email: {
    type: String,
    unique: true
  },
  address: String,
  phone_number: {
    type: Number,
    unique: true
  },
  user_icon_url: String,
  created_at: {
    type: Date,
    "default": Date.now
  },
  is_active: {
    type: Boolean,
    "default": true
  }
});

module.exports = mongoose.model('User', UserSchema);

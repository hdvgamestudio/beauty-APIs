var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  user_name: {
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
  created_at: Date

});

module.exports = mongoose.model('User', UserSchema);

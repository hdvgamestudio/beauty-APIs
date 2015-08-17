var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

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
  sex: {
    type: String,
    enum: ["N", "M","F"],
    "default": "N"
  },
  birthday: Date,
  email: {
    type: String
  },
  address: String,
  phone_number: {
    type: Number,
  },
  user_icon_url: String,
  created_at: {
    type: Date,
    "default": Date.now
  },
  is_active: {
    type: Boolean,
    "default": true
  },
  isAdmin: {
    type: Boolean,
    "default": false
  }
});


/*-------Methods--------*/

// Save password encrypted by Bcrypt
UserSchema.pre('save', function(next) {
    var user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // Hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // Override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// Compare password
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

/*-------End Methods--------*/

// Export the mongoose model
module.exports = mongoose.model('User', UserSchema);

var mongoose                = require('mongoose'),
    bcrypt                  = require('bcrypt'),
    SALT_WORK_FACTOR        = 10;

var UserSchema = new mongoose.Schema({
  //internal account
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  genre: {
    type: String,
    enum: ["notgiven", "male","female"],
    "default": "notgiven"
  },
  birthday: {
    type: Date
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  phone_number: {
    type: Number,
  },
  avatar_url: {
    type: String,
  },
  created_at: {
    type: Date,
    "default": Date.now
  },
  modified_at: {
    type: Date,
  },
  is_active: {
    type: Boolean,
    "default": true
  },
  is_admin: {
    type: Boolean,
    "default": false
  },
  social_accounts: [{
    account_type: {
      type: String,
      enum: [ "facebook", "twitter", "google" ],
      required: true
    },
    uuid: {
      type: String,
      required: true
    },
    access_token: {
      type: String
    },
    email: {
      type: String
    },
    name: {
      type: String
    }
  }]
});
//UserSchema.set('versionKey', false);

/*-------Methods--------*/

// Compare password
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', UserSchema);

// Save password encrypted by Bcrypt
UserSchema.pre('save', function(next) {
    var user = this;

    user.modified_at = new Date();
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

/*-------End Methods--------*/

// Export the mongoose model
module.exports = mongoose.model('User');

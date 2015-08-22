var mongoose                = require('mongoose'),
    bcrypt                  = require('bcrypt'),
    SALT_WORK_FACTOR        = 10;

var Error409                = require('../../lib/errors/error409');
var ApiMessages             = require('../../lib/apiMessage');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
  },
	accounts: [{
		account_type: {
			//enum: ['internal', 'facebook', 'twitter', 'google']
			type: String
		},
		uid: {
			type: String
		},
    access_token: {
      type: String
    },
    oss_attributes: {
      type: Array
    }
	}],
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

    // Check if username exists
    User.find({ name: user.name }, function(err, users) {
      if (users.length) return next(new Error409(409, ApiMessages.USERNAME_ALREADY_EXISTS));
    });

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

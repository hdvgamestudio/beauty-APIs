var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
  origin: {
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    url: {
      type: String
    }
  },
  type: {
    type: String,
    enum: ['avatar', 'product']
  },
  is_processed: {
    type: Boolean,
    "default": false
  },
  created_at: {
    type: Date,
    "default": Date.now
  },
  modified_at: {
    type: Date
  },
  tiny: {
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    url: {
      type: String
    }
  },
  small: {
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    url: {
      type: String
    }
  },
  medium: {
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    url: {
      type: String
    }
  },
  large: {
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    url: {
      type: String
    }
  },
  huge: {
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    url: {
      type: String
    }
  }
});

module.exports = mongoose.model('Image', ImageSchema);

ImageSchema.pre('save', function(next) {
  var image = this;
  image.modified_at = new Date();
  next();
});

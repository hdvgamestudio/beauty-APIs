var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassificationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  childs: [{
    _id: {
      type: Schema.ObjectId
    },
    name: {
      type: String
    }
  }],
  parents: {
    type: Schema.ObjectId,
  }
});

module.exports = mongoose.model('Classification', ClassificationSchema);

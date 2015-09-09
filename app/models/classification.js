var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassificationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  childs: [{
    type: Schema.ObjectId,
    ref: 'Classification'
  }],
  parents: {
    type: Schema.ObjectId,
    ref: 'Classification'
  }
});

module.exports = mongoose.model('Classification', ClassificationSchema);

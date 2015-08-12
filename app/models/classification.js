var mongoose = require('mongoose');

var ClassificationSchema = new mongoose.Schema({
  usage: {usage_id: String, usage: String},
  physical_nature: {physical_nature_id: String, physical_nature: String},
  functions: {functions_id: String, functions: String}
});

module.exports = mongoose.model('Classification', ClassificationSchema);

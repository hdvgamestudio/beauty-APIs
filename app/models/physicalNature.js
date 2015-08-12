var mongoose = require('mongoose');

var PhysicalNatureSchema = new mongoose.Schema({
  physical_nature: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('PhysicalNature', PhysicalNatureSchema);

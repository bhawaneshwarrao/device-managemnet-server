const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  device: {
    type: String,
    required: true,
  },
  os: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  lastCheckedOutBy: {
    type: String,
  },
  isCheckedOut: {
    type: Boolean,
  },
  checkedOut_at: {
    type: Date,
  },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;

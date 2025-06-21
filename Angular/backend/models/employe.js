const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    enum: ['OrgA', 'OrgB', 'OrgC'], // This list can be fetched from a separate collection later
    required: true
  },
  languages: {
    type: [String],
    required: true
  },
  mobile: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
  },
  services: {
    type: [String],
    required: true
  },
  email: {
    type: String,
    default: '',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  vehicleType: {
    type: String,
    enum: ['Two Wheeler', 'Four Wheeler', 'None'],
    required: true
  },
  kycDocs: {
    type: [String], // could be filenames or file paths
    required: true
  },
  additionalDocs: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', employeeSchema);

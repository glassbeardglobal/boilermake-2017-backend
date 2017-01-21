var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  deviceToken: { type: String },
  goals: { type: Array, default: [] },
  stripeID: { type: String },
  runningCost: { type: Number, default: 0 },
  donated: { type: Number, default: 0 },
  charges: { type: Number, default: 0 },
  costPerFail: { type: Number, default: 60 }
},{
  minimize: false,
  timestamps: true
});

var User = mongoose.model('User', UserSchema);

module.exports = User;

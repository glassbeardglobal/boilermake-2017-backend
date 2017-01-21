var mongoose = require('mongoose');

var GoalSchema = new mongoose.Schema({
  name: { type: String },
  frequency: { type: Number, default: 1 },
  history: { type: [Date], default: [] },
  costPerFail: { type: Number }
},{
  timestamps: true
});

var Goal = mongoose.model('Goal', GoalSchema);

module.exports = Goal;

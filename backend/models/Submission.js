const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  task1: String,
  task2: String,
  timeLeft: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);

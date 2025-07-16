const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  task1: String,
  task2: String,
  timeLeft: Number,
  submittedAt: { type: Date, default: Date.now },
  user: {
  name: String,
  phone: String
},
feedback: String // Nhận xét của giáo viên

});

module.exports = mongoose.model('Submission', SubmissionSchema);

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
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WritingTest'
  },
  feedback: String,
  feedbackBy: String,
  feedbackAt: Date // Nhận xét của giáo viên
});

module.exports = mongoose.model('Submission', SubmissionSchema);

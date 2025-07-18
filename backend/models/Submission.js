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
  teacherName: String,
  feedbackBy: String,
  feedbackAt: Date,
  feedbackSeen: {
  type: Boolean,
  default: false,
}
 // Nhận xét của giáo viên
});

module.exports = mongoose.model('Submission', SubmissionSchema);

const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

// ✅ API lấy danh sách bài viết và populate đề thi
router.get('/list', async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('testId') // 👉 lấy full đề
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error('Lỗi khi lấy submissions:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy submissions' });
  }
});

module.exports = router;

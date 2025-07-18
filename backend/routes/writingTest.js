const express = require('express');
const router = express.Router();
const multer = require('multer');
const WritingTest = require('../models/WritingTests');
const WritingSubmission = require('../models/Submission');

// Cấu hình upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ Tạo đề mới với ảnh
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { task1, task2 } = req.body;
    const task1Image = req.file ? `/uploads/${req.file.filename}` : null;
    const count = await WritingTest.countDocuments();

    const newTest = new WritingTest({
      index: count + 1,
      task1,
      task2,
      task1Image
    });

    await newTest.save();
    res.json({ message: '✅ Tạo đề thành công!', test: newTest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Lỗi khi tạo đề' });
  }
});

// ✅ Giáo viên gửi nhận xét
router.post('/comment', async (req, res) => {
  const { submissionId, feedback, teacherName } = req.body;

  try {
    const updated = await WritingSubmission.findByIdAndUpdate(
      submissionId,
      {
        feedback,
        teacherName: teacherName || 'Giáo viên',
        feedbackAt: new Date(),
        feedbackSeen: false
      },
      { new: true }
    );

    res.json({ message: '✅ Đã gửi nhận xét', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Lỗi khi gửi nhận xét' });
  }
});

// ✅ Học sinh đánh dấu đã xem nhận xét
router.post('/mark-feedback-seen', async (req, res) => {
  const { ids } = req.body;

  try {
    await WritingSubmission.updateMany(
      { _id: { $in: ids } },
      { $set: { feedbackSeen: true } }
    );
    res.json({ message: '✅ Đã đánh dấu là đã xem' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Lỗi khi đánh dấu đã xem' });
  }
});

// ✅ API đếm số nhận xét chưa xem (cho học sinh hiển thị chuông)
router.get('/count-unread-feedback/:phone', async (req, res) => {
  const { phone } = req.params;

  try {
    const count = await WritingSubmission.countDocuments({
      'user.phone': phone,
      feedbackSeen: false,
      feedback: { $ne: null }
    });

    res.json({ unreadFeedbackCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Lỗi khi đếm nhận xét chưa đọc' });
  }
});

// ✅ Lấy tất cả đề writing
router.get('/', async (req, res) => {
  try {
    const tests = await WritingTest.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi khi lấy danh sách đề' });
  }
});

// ✅ Lấy chi tiết đề theo ID
router.get('/:id', async (req, res) => {
  try {
    const test = await WritingTest.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Không tìm thấy đề' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi khi lấy đề' });
  }
});

module.exports = router;

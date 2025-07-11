const express = require('express');
const router = express.Router();
const multer = require('multer');
const WritingTest = require('../models/WritingTests');

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });
// Tạo đề mới với ảnh
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { task1, task2 } = req.body;
    const task1Image = req.file ? `/uploads/${req.file.filename}` : null;
    const count = await WritingTest.countDocuments(); // ✅ Đếm số đề hiện có

    const newTest = new WritingTest({ 
      index: count + 1, // ✅ Gán số thứ tự đề mới
      task1, task2, task1Image 
    });
    await newTest.save();

    res.json({ message: '✅ Tạo đề thành công!', test: newTest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Lỗi khi tạo đề' });
  }
});
// Lấy tất cả đề
router.get('/', async (req, res) => {
  try {
    const tests = await WritingTest.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đề' });
  }
});

// Lấy đề theo ID
router.get('/:id', async (req, res) => {
  try {
    const test = await WritingTest.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Không tìm thấy đề' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy đề' });
  }
});



module.exports = router;

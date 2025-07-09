const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const WritingTest = require('../models/WritingTest');
// Setup multer để lưu file ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });
const writingTests = [
  {
    id: 1,
    name: "Writing Test 1",
    task1: "The chart below shows the percentage of males and females who do housework...",
    task2: "Some people think moving abroad is good for children, others say it's bad. Discuss both views and give your opinion."
  },
  {
    id: 2,
    name: "Writing Test 2",
    task1: "The diagram below shows how electricity is generated from wind power...",
    task2: "Many people today change jobs frequently. Is this a good or bad thing?"
  }
];

router.get('/', (req, res) => {
  res.json(writingTests);
});


router.get('/:id', (req, res) => {
  const test = writingTests.find(t => t.id === parseInt(req.params.id));
  if (!test) return res.status(404).json({ message: 'Test not found' });
  res.json(test);
});
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { task1, task2 } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const test = new WritingTest({ task1, task2, task1Image: imagePath });
    await test.save();
    res.json({ message: '✅ Tạo đề thành công', test });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Lỗi khi tạo đề' });
  }
});

// API: Lấy đề theo ID
router.get('/:id', async (req, res) => {
  try {
    const test = await WritingTest.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Không tìm thấy đề' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy đề' });
  }
});
// API: Thêm đề thi writing 
router.post('/', async (req, res) => {
  try {
    const { task1, task1Image, task2 } = req.body;
    const newTest = new WritingTest({ task1, task1Image, task2 });
    await newTest.save();
    res.json({ message: 'Đã tạo đề mới!', test: newTest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi tạo đề' });
  }
});
// Tạo đề mới với ảnh
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { task1, task2 } = req.body;
    const image = req.file ? req.file.filename : null;

    const newTest = new WritingTest({ task1, task2, image });
    await newTest.save();

    res.json({ message: '✅ Tạo đề thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Lỗi khi tạo đề' });
  }
});
module.exports = router;

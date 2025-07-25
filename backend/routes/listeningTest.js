const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// 🔧 Cài đặt lưu audio
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/audio/';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage: storage });

// 👉 POST /api/listening-tests/create
router.post('/create', upload.single('audio'), (req, res) => {
  try {
    const { title, sections } = req.body;
    const audioUrl = `/uploads/audio/${req.file.filename}`;

    // 🧾 Lưu JSON vào file tạm (có thể thay bằng DB)
    const newTest = {
      id: Date.now(),
      title,
      audioUrl,
      sections: JSON.parse(sections),
      createdAt: new Date()
    };

    // Đảm bảo thư mục tồn tại
    const testPath = path.join(__dirname, '..', 'data');
    fs.mkdirSync(testPath, { recursive: true });

    // Ghi vào file
    const filePath = path.join(testPath, 'listening-tests.json');
    let existingTests = [];
    if (fs.existsSync(filePath)) {
      existingTests = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    existingTests.push(newTest);
    fs.writeFileSync(filePath, JSON.stringify(existingTests, null, 2));

    res.status(201).json({ message: '✅ Tạo bài test thành công!', test: newTest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Lỗi server khi tạo bài test.' });
  }
});

module.exports = router;

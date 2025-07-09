const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/ket_test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Serve ảnh
// app.use('/uploads', express.static('uploads'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
const writingTestsRoute = require('./routes/writingTest');
app.use('/api/writing-tests', writingTestsRoute);

// Model user
const User = require('./models/User');

// Đăng ký
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, role } = req.body;
  if (!name || !phone) return res.status(400).json({ message: 'Thiếu thông tin' });

  const existing = await User.findOne({ phone });
  if (existing) return res.status(409).json({ message: 'Số điện thoại đã tồn tại' });

  try {
    const newUser = new User({ name, phone, role: role || 'student' });
    await newUser.save();
    res.json({ user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});

// Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  const { name, phone, role } = req.body;
  try {
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ name, phone, role });
      await user.save();
    }
    res.json({ message: 'Đăng nhập thành công', user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});

// Nộp bài viết
const Submission = require('./models/Submission');
app.post('/api/writing/submit', async (req, res) => {
  try {
    const { task1, task2, timeLeft } = req.body;
    const newSubmission = new Submission({ task1, task2, timeLeft });
    await newSubmission.save();
    res.json({ message: '✅ Bài viết đã được lưu' });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi khi lưu bài viết' });
  }
});

// Lấy danh sách bài viết
app.get('/api/writing/list', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài viết' });
  }
});

app.listen(5000, () => console.log('🚀 Server running at http://localhost:5000'));

require('dotenv').config(); // dòng này phải ở rất gần đầu
const nodemailer = require('nodemailer');
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
const WritingTest = require('./models/WritingTests'); // ✅ THÊM DÒNG NÀY

app.post('/api/writing/submit', async (req, res) => {
  try {
  
    const { task1, task2, timeLeft, user, testId } = req.body;
    const newSubmission = new Submission({ task1, task2, timeLeft,user, testId, feedbackSeen: false });
    await newSubmission.save();

    // Gửi email tới admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
      const test = await WritingTest.findById(testId);
      const index = test?.index || 'Chưa rõ';
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `📨 Bài viết mới từ học sinh ${user.name} (Đề số ${index})`,
      html: `
        <p><strong>👤 Học sinh:</strong> ${user.name}</p>
    <p><strong>📞 Số điện thoại:</strong> ${user.phone}</p>
    <p><strong>📝 Đề số:</strong> ${index}</p>
    <h2>Task 1</h2>
    <p>${task1.replace(/\n/g, '<br>')}</p>
    <h2>Task 2</h2>
    <p>${task2.replace(/\n/g, '<br>')}</p>
    <p><b>⏳ Thời gian còn lại:</b> ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây</p>
  `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: '✅ Bài viết đã được lưu và gửi email!' });

  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi khi lưu bài viết' });
  }
});

// Lấy danh sách bài viết
app.get('/api/writing/list', async (req, res) => {
  try {
    const submissions = await Submission.find()
    .populate('testId', 'index task1 task2 task1Image') // Thêm populate để lấy thông tin đề thi
    .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài viết' });
  }
});
// Nhận xét bài viết
// app.post('/api/writing/comment', async (req, res) => {
//   const { submissionId, feedback } = req.body;

//   if (!submissionId || !feedback) {
//     return res.status(400).json({ message: 'Thiếu submissionId hoặc feedback' });
//   }

//   try {
//     const submission = await Submission.findById(submissionId);
//     if (!submission) {
//       return res.status(404).json({ message: 'Không tìm thấy bài viết' });
//     }

//     submission.feedback = feedback;
//     await submission.save();

//     res.json({ message: '✅ Gửi nhận xét thành công' });
//   } catch (err) {
//     console.error('❌ Lỗi khi gửi nhận xét:', err);
//     res.status(500).json({ message: '❌ Lỗi server khi gửi nhận xét' });
//   }
// });
app.post('/api/writing/comment', async (req, res) => {
  const { submissionId, feedback, teacherName } = req.body;
  
  if (!submissionId || !feedback || !teacherName) {
    return res.status(400).json({ message: 'Thiếu thông tin gửi nhận xét.' });
  }

  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    submission.feedback = feedback;
    submission.feedbackBy = teacherName;
    submission.feedbackAt = new Date();
    await submission.save();

    res.json({ message: '✅ Gửi nhận xét thành công' });
  } catch (err) {
    console.error('❌ Lỗi khi gửi nhận xét:', err);
    res.status(500).json({ message: '❌ Lỗi server khi gửi nhận xét' });
  }
});
app.post('/api/writing/mark-feedback-seen', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Thiếu số điện thoại học sinh.' });
  }

  try {
    const result = await Submission.updateMany(
      { 'user.phone': phone, feedback: { $exists: true }, feedbackSeen: { $ne: true } },
      { $set: { feedbackSeen: true } }
    );

    res.json({
      message: '✅ Đã đánh dấu nhận xét là đã xem.',
      updatedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật trạng thái nhận xét:', err);
    res.status(500).json({ message: '❌ Lỗi server khi cập nhật nhận xét.' });
  }
});


app.listen(5000, () => console.log('🚀 Server running at http://localhost:5000'));

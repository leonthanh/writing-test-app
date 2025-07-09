// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const writingTestsRoute = require('./routes/writingTests');
// app.use('/api/writing-tests', writingTestsRoute);


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/writing-tests', writingTestsRoute);
app.use('/uploads', express.static('uploads')); // để truy cập ảnh

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ket_test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
// Models
const submissions = []; 
const User = require('./models/User');
// Middleware to check authentication
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, role } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(409).json({ message: 'Số điện thoại đã tồn tại' });
  }

  try {
    const newUser = new User({ name, phone, role: role || 'student' });
    await newUser.save();

    res.json({ user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});
// Hàm đăng nhập
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
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});
// Models
const Submission = require('./models/Submission');
// Hàm nộp bài viết
app.post('/api/writing/submit', async (req, res) => {
  try {
    const { task1, task2, timeLeft } = req.body;
    const newSubmission = new Submission({ task1, task2, timeLeft });
    await newSubmission.save();

    res.json({ message: '✅ Bài viết đã được lưu vào MongoDB!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Lỗi khi lưu MongoDB' });
  }
});

// Hàm lấy danh sách bài viết
app.get('/api/tests', (req, res) => {
  res.json([
    {
      id: 1,
      name: "KET Listening Test 1",
      parts: [
        {
          partNumber: 1,
          audio: "https://example.com/audio/part1.mp3", // sau này dùng audio thật
          questions: [
            {
              id: 1,
              text: "What is Paul doing?",
              options: ["shopping", "swimming", "reading"],
              correct: 0 // dùng để so kết quả
            },
            {
              id: 2,
              text: "What time is the meeting?",
              options: ["10:00", "11:00", "12:00"],
              correct: 1
            }
          ]
        },
        {
          partNumber: 2,
          audio: "https://example.com/audio/part2.mp3",
          questions: [
            {
              id: 3,
              text: "Where is the bus stop?",
              options: ["In front of the school", "Next to the park", "Behind the shop"],
              correct: 2
            }
          ]
        }
      ]
    }
  ]);
});
// 🆕 Route trả đề viết theo id
app.get('/api/writing-tests/:id', (req, res) => {
  const { id } = req.params;

  // Giả lập nhiều đề khác nhau
  const writingTests = {
    1: {
      task1: `The first chart below shows the percentages of women and men involved in cooking, cleaning, pet care and house repairs.
The second chart shows how much time they spend per day on each activity.`,
      task2: `Some people think it is beneficial for children when families move overseas for work.
Others believe it can be difficult for them.
Discuss both views and give your opinion.`
    },
    2: {
      task1: `The chart below shows the number of hours people in different countries spend on social media.`,
      task2: `Some people think social media is helpful for communication.
Others think it causes problems.
Discuss both views and give your opinion.`
    }
  };

  const test = writingTests[id];
  if (test) {
    res.json(test);
  } else {
    res.status(404).json({ message: 'Không tìm thấy đề' });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));

app.get('/api/writing/list', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài viết' });
  }
});



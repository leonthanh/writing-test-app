const express = require('express');
const router = express.Router();
const User = require('../models/User'); // đảm bảo bạn có models/User.js

// Đăng ký
router.post('/register', async (req, res) => {
  const { name, phone, role } = req.body;
  if (!name || !phone || !role) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  try {
    let existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'SĐT đã tồn tại' });

    const newUser = new User({ name, phone, role });
    await newUser.save();

    res.json({ message: 'Đăng ký thành công', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { name, phone, role } = req.body;
  if (!name || !phone || !role) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  try {
    let user = await User.findOne({ phone, role });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json({ message: 'Đăng nhập thành công', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});

module.exports = router;

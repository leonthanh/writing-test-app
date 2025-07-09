const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

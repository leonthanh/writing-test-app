const mongoose = require('mongoose');

const WritingTestSchema = new mongoose.Schema({
  task1: { type: String, required: true },
  task2: { type: String, required: true },
  task1Image: { type: String }, // để lưu đường dẫn ảnh
}, { timestamps: true });

module.exports = mongoose.model('WritingTest', WritingTestSchema);

const mongoose = require('mongoose');

const WritingTestSchema = new mongoose.Schema({
  task1: { type: String, required: true },
  task2: { type: String, required: true },
  imageUrl: { type: String }, // nếu muốn đính kèm hình ảnh trong đề bài
});

module.exports = mongoose.model('WritingTest', WritingTestSchema);

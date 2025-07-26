const mongoose = require('mongoose');

const ListeningTestSchema = new mongoose.Schema({
  title: String,
  audioPath: String,
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],
});

module.exports = mongoose.model('ListeningTest', ListeningTestSchema);

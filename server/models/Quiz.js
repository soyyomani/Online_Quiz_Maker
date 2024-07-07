const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true }
});

const quizSchema = new Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;

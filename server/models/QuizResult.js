const mongoose = require('mongoose');
const Schema = mongoose.Schema;

  
const quizResultSchema = new Schema({
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },  
  score: { type: Number, required: true },
  feedback: { type: String }
});

 
const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;

const express = require('express');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
 
router.post('/', authMiddleware, async (req, res) => {
  const { title, questions } = req.body;

  try {
    const quiz = new Quiz({
      title,
      questions,
      createdBy: req.user.id
    });

    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all quizzes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

 
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/:id/submit', authMiddleware, async (req, res) => {
  const { answers } = req.body;
  const quizId = req.params.id;
  let score = 0;
  let feedback = '';

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

   
    answers.forEach(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      if (question && question.correctAnswer === answer.answer) {
        score++;
      }
    });
 
    if (score === quiz.questions.length) {
      feedback = 'Excellent! You answered all questions correctly.';
    } else if (score > quiz.questions.length / 2) {
      feedback = 'Good job! You passed the quiz.';
    } else {
      feedback = 'You could improve. Try again!';
    }

 
    const quizResult = new QuizResult({
      quiz: quizId,
      score,
      feedback
    });
    await quizResult.save();

    
    res.json({
      quizId: quiz._id,
      submittedAnswers: answers,
      score,
      feedback
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


 
router.get('/:id/result', authMiddleware, async (req, res) => {
  try {
    const quizId = req.params.id;
    const quizResult = await QuizResult.findOne({ quiz: quizId }).populate('quiz');

    if (!quizResult) {
      return res.status(404).json({ msg: 'Quiz result not found' });
    }

    const resultData = {
      quizTitle: quizResult.quiz.title,
      score: quizResult.score,
      totalQuestions: quizResult.quiz.questions.length,
      feedback: quizResult.feedback
    };

    res.json(resultData);
  } catch (err) {
    console.error('Error fetching quiz result:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

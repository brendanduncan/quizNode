var Quiz = require('../models/quiz').Quiz;
var Question = require('../models/quiz').Question;
var QuizAttempt = require('../models/quiz').QuizAttempt;
var QuestionAttempt = require('../models/quiz').QuestionAttempt;
var scoreQuizAttempt = require('../models/quiz').scoreQuizAttempt;

function gradeQuizController(app) {
	// POSTing
	app.post('/gradeQuiz', function(req, res) {
		Quiz.findById(req.body.quizId, function(err, quiz) {
			if(err || quiz == null) {
				res.send("Error 404: quiz doesn't exist");
				return;
			}
			
			if(req.body.chosen === 'undefined') {
				res.send("Error 400: Error in submitted form.")
			}
			
			var questionAttempts = [];
			for(var i in req.body.chosen) {
				if(!(i in quiz.questions)) continue;
				// initialize chosen array to false
				var chosenArray = [];
				for(var answerIndex = 0
						; answerIndex < quiz.questions[i].answers.length
						; answerIndex++) {
					chosenArray.push(false);
				}
				var question = quiz.questions[i];
				for(var idx in req.body.chosen[i]) {
					var choiceIndex = req.body.chosen[i][idx];
					if(choiceIndex in chosenArray) {
						chosenArray[choiceIndex] = true;
					}
				}
				var questionAttempt = new QuestionAttempt({ 
					question: quiz.questions[i],
					chosenAnswers: chosenArray
				});
				questionAttempts.push(questionAttempt);
			}
			var score = scoreQuizAttempt(quiz, questionAttempts);
			var quizAttempt = new QuizAttempt({
				quiz: quiz,
				score: score,
				questionAttempts: questionAttempts
			});
			
			res.render('grade_quiz', {
				'title': 'Graded quiz',
				'quiz': quiz,
				'quizAttempt': quizAttempt
			});
		});
	});
}

module.exports.controller = gradeQuizController;
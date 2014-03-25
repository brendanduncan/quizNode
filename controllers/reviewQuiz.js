var Quiz = require('../models/quiz').Quiz;
var Question = require('../models/quiz').Question;

function reviewQuizController(app) {
	// GETting
	app.get('/reviewQuiz', function(req, res) {
		var quizId = req.query.quiz;
		Quiz.findById(quizId, function(err, quiz) {
			if(err || quiz == null) {
				if(err) console.error(err);
				res.send("Error 404: quiz doesn't exist");
				return;
			}
			res.render('review_quiz', {
				'title': 'Review quiz',
				'quizId': quiz._id,
				'name': quiz.name,
				'desc': quiz.desc,
				'questions': quiz.questions
			});
		});
	});
	
	// POSTing
	app.post('/reviewQuiz', function(req, res) {
		Quiz.findById(req.body.quizId, function(err, quiz) {
			if(err || quiz == null) {
				res.send("Error 404: quiz doesn't exist");
				return;
			}
			
			if(req.body.questionName === 'undefined' || req.body.answer === 'undefined') {
				res.send("Error 400: Error in submitted form.")
			}
			
			// save questions to quiz
			var questions = [];
			
			// dict mapping question number -> (dict of answer number -> boolean)
			// tells whether answer is correct for given question
			var correctAnswersDict = {};
			
			// because checkboxes behave differently, body.correct contains
			// strings "qi-ai", where qi = question index, ai = answer index
			if(req.body.correct !== 'undefined') {
				for(var i in req.body.correct) {
					var qaArray = req.body.correct[i].split("-");
					if(qaArray.length != 2 || isNaN(qaArray[0]) || isNaN(qaArray[1])) {
						continue;
					}
					var qnum = parseInt(qaArray[0]);
					var anum = parseInt(qaArray[1]);
					if(!(qnum in correctAnswersDict)) {
						correctAnswersDict[qnum] = {};
					}
					correctAnswersDict[qnum][anum] = true;
				}
			}
			
			// create questions and add to quiz
			for(var i in req.body.questionName) {
				var answers = [];
				var correctAnswers = []
				var correctCount = 0;
				if(i in req.body.answer) {
					for(var j in req.body.answer[i]) {
						answers.push(req.body.answer[i][j]);
						if(i in correctAnswersDict && j in correctAnswersDict[i] && correctAnswersDict[i][j]) {
							correctAnswers.push(true);
							correctCount++;
						} else {
							correctAnswers.push(false);						
						}
					}
				}
				var question = new Question({ 
					text: req.body.questionName[i],
					number: i,
					answers: answers,
					correctAnswers: correctAnswers,
					useCheckboxes: correctCount != 1
				});
				questions.push(question);
			}
			quiz.questions = questions;
			quiz.save(function (err) {
				if (err) {
					console.error(err);
				}
			});
			res.render('review_quiz', {
				'title': 'Review quiz',
				'quizId': quiz._id,
				'name': quiz.name,
				'desc': quiz.desc,
				'questions': questions
			});
		});
	});
}

module.exports.controller = reviewQuizController;
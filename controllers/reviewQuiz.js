var Quiz = require('../models/quiz').Quiz;
var Question = require('../models/quiz').Question;

function reviewQuizController(app) {
	app.post('/reviewQuiz', function(req, res) {
		// name empty, render form again
		if(typeof req.body.quizId === 'undefined') {
			res.send("Error 404: quiz doesn't exist");
		}
		// success, save quiz to DB
		else {
			Quiz.findById(req.body.quizId, function(err, quiz) {
				if(err) {
					console.error(err);
					res.send("Error 404: quiz doesn't exist");
					return;
				}
				
				// save questions to quiz
				var questions = [];
				for(var i = 0; true; i++) {
					if('questionName'+i in req.body) {
						var question = new Question({ 
							text: req.body['questionName'+i],
							number: i,
							
							// TODO - allow user to specify the following:
							answers: [],
							correctAnswers: [],
							useCheckboxes: false
						});
						questions.push(question);
					}
					else {
						break;
					}
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
		}
	});
}

module.exports.controller = reviewQuizController;
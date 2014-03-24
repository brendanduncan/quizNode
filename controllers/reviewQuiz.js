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
			console.log('questions ' + quiz.questions);
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
				if(err) console.error(err);
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
	});
}

module.exports.controller = reviewQuizController;
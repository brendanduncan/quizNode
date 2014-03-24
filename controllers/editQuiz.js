var Quiz = require('../models/quiz').Quiz;

function submitQuizController(app) {
	// user edits quiz after submision from createQuiz
	app.post('/editQuiz', function(req, res) {
		// name empty, render form again
		if(typeof req.body.name === 'undefined' || !req.body.name.trim()) {
			res.render('create_quiz', { 'title': 'Create quiz', 'error': true });
		}
		// success, save quiz to DB
		else {
			var quizName = req.body.name.trim();
			var quiz = new Quiz({ name: quizName, desc: req.body.desc });
			quiz.save(function (err) {
				if (err) {
					console.error(err);
				}
			});
			res.render('edit_quiz', {
				'title': 'Submit quiz',
				'quizId': quiz._id,
				'name': quizName,
				'desc': req.body.desc,
				'existingQuestions': []
			});
		}
	});
	// user edits quiz
	app.get('/editQuiz', function(req, res) {
		// TODO - user simply editing quiz
		// query string is expected
	});
}

module.exports.controller = submitQuizController;
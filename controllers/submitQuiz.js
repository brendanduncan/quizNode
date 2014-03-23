var Quiz = require('../models/quiz').Quiz;

function submitQuizController(app) {
	app.post('/submitQuiz', function(req, res) {
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
			res.render('submit_quiz', {
				'title': 'Submit quiz',
				'name': quizName,
				'desc': req.body.desc
			});
		}
	});
}

module.exports.controller = submitQuizController;
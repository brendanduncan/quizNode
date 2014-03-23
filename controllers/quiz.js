var Quiz = require('../models/quiz').Quiz;

function quizController(app) {
	app.get('/quizzes', function(req, res) {
		Quiz.find({}).exec(function(err, quizzes) {
  			res.render('quizzes', { 'title': 'All quizzes', 'quizzes': quizzes });
		});
	});
}

module.exports.controller = quizController;
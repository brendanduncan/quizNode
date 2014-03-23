function createQuizController(app) {
	app.get('/createQuiz', function(req, res) {
		res.render('create_quiz', { 'title': 'Create quiz' });
	});
}

module.exports.controller = createQuizController;
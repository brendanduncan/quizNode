function takeQuizController(app) {
	app.get('/takeQuiz', function(req, res) {
		var quizId = req.query.quiz;
		Quiz.findById(quizId, function(err, quiz) {
			if(err || quiz == null) {
				if(err) console.error(err);
				res.send("Error 404: quiz doesn't exist");
				return;
			}
			res.render('take_quiz', {
				'title': 'Submit quiz',
				'quiz': quiz
			});
		});
	});
}

module.exports.controller = takeQuizController;
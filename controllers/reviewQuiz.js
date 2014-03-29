var Quiz = require('../models/quiz').Quiz;
var Question = require('../models/quiz').Question;

// constructs a dict from an array containing values
// i-j, where i and j are integers. The returned dict
// has the format dict[i][j] -> Boolean (always true)
function constructDict(array) {
	var dict = {};
	for(var i in array) {
		var qaArray = array[i].split("-");
		if(qaArray.length != 2 || isNaN(qaArray[0]) || isNaN(qaArray[1])) {
			continue;
		}
		var qnum = parseInt(qaArray[0]);
		var anum = parseInt(qaArray[1]);
		if(!(qnum in dict)) {
			dict[qnum] = {};
		}
		dict[qnum][anum] = true;
	}
	return dict;
}

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
			
			// because checkboxes behave differently, body.correct (and body.deleted)
			// contain strings "qi-ai", where qi = question index, ai = answer index
			var correctAnswersDict = {};
			if(req.body.correct !== 'undefined') {
				correctAnswersDict = constructDict(req.body.correct);
			}
			
			// dict to specify which of the answers have been deleted by the user
			var deletedAnswersDict = {};
			if(req.body.deleted !== 'undefined') {
				deletedAnswersDict = constructDict(req.body.deleted);
			}
			
			// dict to specify which questions are deleted
			var deletedQuestionsDict = {};
			if(req.body.deletedQuestion !== 'undefined') {
				for(i in req.body.deletedQuestion) {
					var qIndex = parseInt(req.body.deletedQuestion[i]);
					deletedQuestionsDict[qIndex] = true;
				}
			}
			
			// create questions and add to quiz
			for(var i in req.body.questionName) {
				// ignore deleted question				
				if(i in deletedQuestionsDict) {
					continue;
				}
				var answers = [];
				var correctAnswers = []
				var correctCount = 0;
				if(i in req.body.answer) {
					for(var j in req.body.answer[i]) {
						// ignored deleted answer
						if(i in deletedAnswersDict && j in deletedAnswersDict[i] && deletedAnswersDict[i][j]) {
							continue;
						}
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
					number: questions.length,
					answers: answers,
					correctAnswers: correctAnswers,
					
					// TODO - this is not always correct logic. Let user
					// specify whether to use checkboxes
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
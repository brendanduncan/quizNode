var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = 
		new Schema({
			text: String,
			number: Number,
			
			// array of strings
			answers: [String],
			
			// parallel array to answers, of booleans
			correctAnswers: [Boolean],
			
			// whether or not user can select multiple
			// answers
			useCheckboxes: Boolean
		});

var QuizSchema =
		new Schema({
        	name: String,
        	desc: String,
			questions: [QuestionSchema]
	  	});

var QuestionAttemptSchema =
	new Schema({
		question: {
	        type: Schema.ObjectId,
	        ref: 'QuestionSchema'
	    },
		chosenAnswers: [Boolean]
	});

var QuizAttemptSchema =
	new Schema({
		quiz: {
	        type: Schema.ObjectId,
	        ref: 'QuizSchema'
	    },
		score: Number,
		questionAttempts: [QuestionAttemptSchema]
	});
		
// how too add methods:
// quizSchema.methods.foo = function() { ... }

// score a quiz - questionAttempts is the array from QuizAttemptSchema
function scoreQuizAttempt(quiz, questionAttempts) {
	try {
		var numCorrect = 0;
		for(var i = 0; i < questionAttempts.length; ++i) {
			if(!(i in quiz.questions)) continue;
			var correctAnswers = quiz.questions[i].correctAnswers;
			var selectedAnswers = questionAttempts[i].chosenAnswers;
			console.log(i + ' correct answers  ' + correctAnswers);
			console.log(i + ' selected answers ' + selectedAnswers);
			for(var j = 0; j < correctAnswers.length; ++j) {
				if(correctAnswers[j] != selectedAnswers[j]) {
					numCorrect--;
					break;
				}
			}
			numCorrect++;
		}
		return numCorrect / quiz.questions.length;
	}
	catch(err) {
		console.log(err);
		return 0;
	}
}

// compile models
Question = mongoose.model('question', QuestionSchema);
Quiz = mongoose.model('quiz', QuizSchema);
QuestionAttempt = mongoose.model('questionAttempt', QuestionAttemptSchema);
QuizAttempt = mongoose.model('quizAttempt', QuizAttemptSchema);

module.exports.Question = Question;
module.exports.Quiz = Quiz;
module.exports.QuestionAttempt = QuestionAttempt;
module.exports.QuizAttempt = QuizAttempt;
module.exports.scoreQuizAttempt = scoreQuizAttempt;
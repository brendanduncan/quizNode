var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = 
		new Schema({
			text: String,
			number: Number,
			
			// array of strings
			answers: Array,
			
			// parallel array to answers, of booleans
			correctAnswers: Array,
			
			// whether or not user can select multiple
			// answers
			useCheckboxes: Boolean
		});

var QuizSchema =
		new Schema({
        	name: String,
        	desc: String,
			questions: [{
				type: mongoose.Schema.Types.ObjectId,
			    ref: QuestionSchema
			}]
	  	});
		
// how too add methods:
// quizSchema.methods.foo = function() { ... }

// compile models
Question = mongoose.model('question', QuestionSchema);
Quiz = mongoose.model('quiz', QuizSchema);

module.exports.Question = Question;
module.exports.Quiz = Quiz;
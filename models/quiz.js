var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema =
		new Schema({
        	name: String,
        	desc: String
	  	});
		
// how too add methods:
// quizSchema.methods.foo = function() { ... }

// compile model
Quiz = mongoose.model('quiz', quizSchema);

module.exports.Quiz = Quiz;
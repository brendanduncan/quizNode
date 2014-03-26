// JQuery is required for this script!

$(document).ready(function() {
	$(".addAnswerBtn").click(function() {
		var questionNumberStr = this.id.split('[')[1];
		var questionNumber = parseInt(questionNumberStr);
		
		// clone last answer input for given question
		var answerElement = $('.answerDiv\\[' + questionNumber + '\\]').last();
		var newAnswer = answerElement.clone();
		
		// empty text inputs and uncheck checkboxes
		var textInput = newAnswer.find('input[type="text"]');
		var checkInput = newAnswer.find('input[type="checkbox"]');
		textInput.val("");
		checkInput.attr('checked', false);
		
		// update input names to reflect new answer number
		var answerNumber = parseInt(checkInput.val().split('-')[1]);
		textInput.attr('name', 'answer['+questionNumber+']['+(answerNumber+1)+']');
		checkInput.val(questionNumber+'-'+(answerNumber+1));
		
		// append new answer div after current last answer div
		newAnswer.insertAfter(answerElement);
	});
	
	/*
	TODO
	$("#addQuestion").click(function() {
		alert('add a question');
	});
	*/
});
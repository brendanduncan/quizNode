// JQuery is required for this script!

function addAnswerButton() {
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
	newAnswer.show();
	
	// assure delete button is bound
	bindQuestionEventHandlers();
}

function deleteAnswerButton() {
	var answerElement = $(this).parent();
	answerElement.find('input[name="deleted"]').attr('checked', true);
	answerElement.hide();
}

function addQuestionButton() {
	// clone last .questionForm div
	var questionElement = $('.questionForm').last();
	var newQuestion = questionElement.clone();
	
	// change questionName[i] textarea name
	var textarea = newQuestion.find('textarea[name^="questionName"]'); // starts with 'questionName'
	var questionNumber = parseInt(textarea.attr('name').split('[')[1]);
	textarea.attr('name', 'questionName['+(questionNumber+1)+']').empty();
	
	// Change question heading
	newQuestion.find("div[class='questionHeader']").text('Question ' +(questionNumber+1+1)+ ' description:');
	
	// change answerDiv[i] class
	newQuestion.find("div[class='answerDiv["+questionNumber+"]']").each(function(idx, val) {
		if(idx > 2) {
			this.remove();
			return;
		}
	});
	newQuestion.find("div[class='answerDiv["+questionNumber+"]']").attr('class', 'answerDiv['+(questionNumber+1)+']');
	
	// change textInput[i][_] names
	newQuestion.find("input[name^='answer\\["+questionNumber+"\\]']").each(function() {
		var nameSplit = this.name.split('[');
		var newName = nameSplit[0] + '[' + (questionNumber+1) + '][' + nameSplit[2];
		this.name = newName;
		this.value = "";
	});
	
	// change checkbox i-_ values
	newQuestion.find('input[type="checkbox"]').each(function() {
		var valSplit = this.value.split('-');
		var newVal = (questionNumber+1) + '-' + valSplit[1];
		this.value = newVal;
		this.checked = false;
	});
	
	// change addAnswer[i] button id
	newQuestion.find("button[id^='addAnswer']").attr('id', 'addAnswer['+(questionNumber+1)+']');
	
	// add new question after previous question
	newQuestion.insertAfter(questionElement);
	newQuestion.show();
	
	// register bound event handlers
	bindQuestionEventHandlers();
}

function bindQuestionEventHandlers() {
	$(".addAnswerBtn").unbind('click').click(addAnswerButton);
	$(".deleteAnswerBtn").unbind('click').click(deleteAnswerButton);
}

$(document).ready(function() {
	bindQuestionEventHandlers();
	$("#addQuestion").click(addQuestionButton);
});
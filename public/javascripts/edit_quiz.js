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
	checkInput.prop('checked', false);
	
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

function addQuestionButton() {
	// clone last .questionForm div
	var questionElement = $('.questionForm').last();
	var newQuestion = questionElement.clone();
	
	// change questionName[i] textarea name
	var textarea = newQuestion.find('textarea[name^="questionName"]'); // starts with 'questionName'
	var questionNumber = parseInt(textarea.attr('name').split('[')[1]);
	textarea.attr('name', 'questionName['+(questionNumber+1)+']').empty();
	
	// change answerDiv[i] class
	newQuestion.find("div[class='answerDiv["+questionNumber+"]']").each(function(idx, val) {
		if(idx > 2) {
			this.remove();
			return;
		}
	});
	newQuestion.find("div[class='answerDiv["+questionNumber+"]']").attr('class', 'answerDiv['+(questionNumber+1)+']').show();
	
	// change textInput[i][_] names
	newQuestion.find("input[name^='answer\\["+questionNumber+"\\]']").each(function() {
		var nameSplit = this.name.split('[');
		var newName = nameSplit[0] + '[' + (questionNumber+1) + '][' + nameSplit[2];
		$(this).attr('name', newName);
		$(this).val("");
	});
	
	// change checkbox i-_ values
	newQuestion.find('input[type="checkbox"]').each(function() {
		var valSplit = this.value.split('-');
		var newVal = (questionNumber+1) + '-' + valSplit[1];
		$(this).val(newVal);
		$(this).prop('checked', false);
	});
	
	// change addAnswer[i] button id
	newQuestion.find("button[id^='addAnswer']").attr('id', 'addAnswer['+(questionNumber+1)+']');
	
	// add new question after previous question
	newQuestion.insertAfter(questionElement);
	newQuestion.show();
	
	// register bound event handlers
	bindQuestionEventHandlers();
}

function deleteAnswerButton() {
	var answerElement = $(this).closest('div[class^="answerDiv"]');
	answerElement.find('input[name="deleted"]').prop('checked', true);
	console.log('in delete');
	answerElement.hide();
}

function deleteQuestionButton() {
	var questionElement = $(this).closest('div[class="questionForm"]');
	questionElement.find('input[name="deletedQuestion"]').prop('checked', true);
	questionElement.hide();
}

function bindQuestionEventHandlers() {
	$(".addAnswerBtn").unbind('click').click(addAnswerButton);
	$(".deleteAnswerBtn").unbind('click').click(deleteAnswerButton);
	$(".deleteQuestionBtn").unbind('click').click(deleteQuestionButton);
}

$(document).ready(function() {
	bindQuestionEventHandlers();
	$("#addQuestion").click(addQuestionButton);
});
import * as actionSDK from "@microsoft/m365-action-sdk";
import { Localizer } from '../common/ActionSdkHelper';

// var question_counter = 1
var questionCount = 0;
let questions = new Array();
let validate = true;
let setting_text = '';

let question_section = '';
let opt = '';
let request;

let optionKey = '';
let addMoreOptionsKey = '';
let choicesKey = '';
let questionTitleKey = '';
let checkMeKey = '';
let nextKey = '';
let backKey = '';
let requiredKey = '';
let dueByKey = '';
let resultVisibleToKey = '';
let resultEveryoneKey = '';
let resultMeKey = '';
let correctAnswerKey = '';
let everyoneKey = '';
let onlyMeKey = '';
let showCorrectAnswerKey = '';
let answerCannotChangeKey = '';

/***********************************  Manage Questions *********************************/
$(document).on("click", "#add-questions", function() {
    $(".slideup-content").slideUp("slow", function() {});

    $('.section-2').hide();
    $('.section-2-footer').hide();

    if ($('form.sec1 > div.question-section').length > 0) {
        $('form.sec1 > div.question-section').remove();
        $('form.sec1 > .question_button').remove();
        $('form.sec1 > div.question-footer').remove();
    }

    $('form.sec1').append(questions_section);
    $('form.sec1').append(add_question_button);
    $('form.sec1').append(question_footer);

    if ($('form.sec1 > div.question-section').length == 1) {
        $('form.sec1 > div.question-section').find('.container').addClass('pt-4');
    }

    var question_counter = 0;
    $("div.question-container:visible").each(function(index, elem) {
        question_counter = index + 1;
        $(elem)
            .find("span.question-number")
            .text(question_counter + ".");
        $(elem).attr({ id: "question" + question_counter });
    });

});

$(document).on("click", "#add-questions-same-section", function() {
    $(".slideup-content").slideUp("slow", function() {});

    var question_counter;
    $('form.sec1').append(questions_section);
    $('form > .question_button').remove();

    $("div.question-container:visible").each(function(index, elem) {
        question_counter = index + 1;
        $(elem)
            .find("span.question-number")
            .text(question_counter + ".");
        $(elem).attr({ id: "question" + question_counter });
    });
    questionCount++;

    $('form.sec1').append(add_question_button);
});

$(document).on("click", "#back-question", function() {
    $(".slideup-content").slideUp("slow", function() {});

    $(".question-section").hide();
    $(".add_question_button").hide();
    $(".question-footer").hide();
    $(".question_button").hide();

    $(".section-2").show();
    $(".section-2-footer").show();
});

/* Remove Questions */
$(document).on("click", ".remove-question", function() {
    $(".slideup-content").slideUp("slow", function() {});

    var element = $(this);
    var data_id = $(this).parents('.question-container').attr('id');

    if ($("div.question-container:visible").length > 1) {
        $("#exampleModalCenter")
            .find("#exampleModalLongTitle")
            .html('<svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg" class="gt gs mt--4">< path d = "m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" ></path ><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path></svg > Delete?');
        $("#exampleModalCenter")
            .find(".modal-body")
            .html("Are you sure you want to delete?");
        $("#exampleModalCenter")
            .find(".modal-footer")
            .html(
                '<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Close</button><button type="button" data-id="' + data_id + '" class="btn btn-primary" id="delete-question">Ok</button>'
            );
        $("#exampleModalCenter").modal("show");

    } else {
        $("#exampleModalCenter")
            .find("#exampleModalLongTitle")
            .html('<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="gt gs mt--4"><g><g><g><path d="M507.113,428.415L287.215,47.541c-6.515-11.285-18.184-18.022-31.215-18.022c-13.031,0-24.7,6.737-31.215,18.022L4.887,428.415c-6.516,11.285-6.516,24.76,0,36.044c6.515,11.285,18.184,18.022,31.215,18.022h439.796c13.031,0,24.7-6.737,31.215-18.022C513.629,453.175,513.629,439.7,507.113,428.415z M481.101,449.441c-0.647,1.122-2.186,3.004-5.202,3.004H36.102c-3.018,0-4.556-1.881-5.202-3.004c-0.647-1.121-1.509-3.394,0-6.007L250.797,62.559c1.509-2.613,3.907-3.004,5.202-3.004c1.296,0,3.694,0.39,5.202,3.004L481.1,443.434C482.61,446.047,481.748,448.32,481.101,449.441z"/><rect x="240.987" y="166.095" width="30.037" height="160.197" /><circle cx="256.005" cy="376.354" r="20.025" /></g></g></g > <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg > Notice!');
        $("#exampleModalCenter")
            .find(".modal-body")
            .html("For quiz atleast one question is required.");
        $("#exampleModalCenter")
            .find(".modal-footer")
            .html(
                '<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Close</button>'
            );
        $("#exampleModalCenter").modal("show");
    }
});

$(document).on("click", "#delete-question", function() {
    $(".slideup-content").slideUp("slow", function() {});

    var element = $(this).attr('data-id');
    $("#exampleModalCenter").modal("hide");
    $('#' + element).parents('div.question-section').remove();
    var question_counter;
    $("div.question-container:visible").each(function(index, elem) {
        question_counter = index + 1;
        $(elem).find("span.question-number").text(question_counter);
        $(elem).attr({ id: "question" + question_counter });
    });
});

/* Add Options */
$(document).on("click", ".add-options", function() {
    $(".slideup-content").slideUp("slow", function() {});

    if (
        $(this)
        .parents("div.container")
        .find("div.option-div > div.input-group > input[type='text']").length >=
        10
    ) {
        $("#exampleModalCenter")
            .find("#exampleModalLongTitle")
            .html(`<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="gt gs mt--4">
<g>
	<g>
		<g>
			<path d="M507.113,428.415L287.215,47.541c-6.515-11.285-18.184-18.022-31.215-18.022c-13.031,0-24.7,6.737-31.215,18.022
				L4.887,428.415c-6.516,11.285-6.516,24.76,0,36.044c6.515,11.285,18.184,18.022,31.215,18.022h439.796
				c13.031,0,24.7-6.737,31.215-18.022C513.629,453.175,513.629,439.7,507.113,428.415z M481.101,449.441
				c-0.647,1.122-2.186,3.004-5.202,3.004H36.102c-3.018,0-4.556-1.881-5.202-3.004c-0.647-1.121-1.509-3.394,0-6.007
				L250.797,62.559c1.509-2.613,3.907-3.004,5.202-3.004c1.296,0,3.694,0.39,5.202,3.004L481.1,443.434
				C482.61,446.047,481.748,448.32,481.101,449.441z"/>
			<rect x="240.987" y="166.095" width="30.037" height="160.197"/>
			<circle cx="256.005" cy="376.354" r="20.025"/>
		</g>
	</g>
</g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg> Notice!`);
        $("#exampleModalCenter")
            .find(".modal-body")
            .html("Maximum 10 options allowed for a question");
        $("#exampleModalCenter")
            .find(".modal-footer")
            .html(
                '<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Close</button>'
            );
        $("#exampleModalCenter").modal("show");
        // alert("Maximum 10 options allowed for a Question");
        return false;
    }
    $(this).parents(".container").find("div.option-div:last").after(opt.clone());
    // $("div.input-group.mb-2.option-div").last().find("input");

    var selector = $(this).parents("div.container");
    $(selector)
        .find('div.option-div > div.input-group > input[type="text"]')
        .each(function(index, elem) {
            var counter = index + 1;
            $(elem).attr({
                placeholder: "Option " + counter,
            });
            $(elem).attr({ id: "option" + counter });
            $(elem)
                .parents(".option-div")
                .find("input.form-check-input")
                .attr({ id: "check" + counter });
        });
});

/* Remove Options */
$(document).on("click", ".remove-option", function(eve) {
    $(".slideup-content").slideUp("slow", function() {});

    if (
        $(this).parents("div.question-container").find("div.option-div").length > 2
    ) {
        var selector = $(this).closest("div.container");
        $(this).parents("div.option-div").remove();
        $(selector)
            .find('div.option-div > div.input-group > input[type="text"]')
            .each(function(index, elem) {
                var counter = index + 1;
                $(elem).attr({
                    placeholder: "Option " + counter,
                });
                $(elem).attr({ id: "option" + counter });
                $(elem)
                    .parents(".option-div")
                    .find("input.form-check-input")
                    .attr({ id: "check" + counter });
            });
    } else {
        $("#exampleModalCenter")
            .find("#exampleModalLongTitle")
            .html(`<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="gt gs mt--4">
<g>
	<g>
		<g>
			<path d="M507.113,428.415L287.215,47.541c-6.515-11.285-18.184-18.022-31.215-18.022c-13.031,0-24.7,6.737-31.215,18.022
				L4.887,428.415c-6.516,11.285-6.516,24.76,0,36.044c6.515,11.285,18.184,18.022,31.215,18.022h439.796
				c13.031,0,24.7-6.737,31.215-18.022C513.629,453.175,513.629,439.7,507.113,428.415z M481.101,449.441
				c-0.647,1.122-2.186,3.004-5.202,3.004H36.102c-3.018,0-4.556-1.881-5.202-3.004c-0.647-1.121-1.509-3.394,0-6.007
				L250.797,62.559c1.509-2.613,3.907-3.004,5.202-3.004c1.296,0,3.694,0.39,5.202,3.004L481.1,443.434
				C482.61,446.047,481.748,448.32,481.101,449.441z"/>
			<rect x="240.987" y="166.095" width="30.037" height="160.197"/>
			<circle cx="256.005" cy="376.354" r="20.025"/>
		</g>
	</g>
</g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg> Notice!`);
        $("#exampleModalCenter")
            .find(".modal-body")
            .html("At least 2 options required for a Question.");
        $("#exampleModalCenter")
            .find(".modal-footer")
            .html(
                '<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Close</button>'
            );
        $("#exampleModalCenter").modal("show");
    }
});

$(document).on("click", "#question-done", function() {
    $(".slideup-content").slideUp("slow", function() {});

    $('#question-done').prop('disabled', true);

    /* Validate */
    var error_text = "";
    var question_number = 0;
    var error = false;
    validate = true;
    $("input[type='text']").removeClass("danger");
    $("label.label-alert").remove();
    $("div.card-box-alert").removeClass("card-box-alert").addClass("card-box");

    $("form")
        .find("input[type='text']")
        .each(function() {
            var element = $(this);
            if (element.val() == "") {
                validate = false;

                $(this)
                    .parents("div.card-box")
                    .removeClass("card-box")
                    .addClass("card-box-alert");

                if (element.attr("id").startsWith("question-title")) {
                    $(this).addClass("danger");
                    $(this)
                        .parents("div.input-group")
                        .before(
                            '<label class="label-alert d-block"><small>Required</small></label>'
                        );

                } else if (element.attr("id").startsWith("option")) {
                    $(this).addClass("danger");
                    $(this)
                        .parents("div.input-group")
                        .before(
                            '<label class="label-alert d-block"><small>Required</small></label>'
                        );

                    error_text +=
                        "<p>Blank option not allowed for " +
                        element.attr("placeholder") +
                        ".</p>";
                }
            }
        });

    var questionCount = $("form div.question-section").find("div.container.question-container").length;
    questions = new Array();

    for (var i = 1; i <= questionCount; i++) {
        var is_selected = 0;

        $(".question-section > #question" + i)
            .find("div.option-div")
            .each(function(index, elem) {
                var count = index + 1;
                if (
                    $(".question-section > #question" + i)
                    .find("#check" + count)
                    .is(":checked")
                ) {
                    // if it is checked
                    is_selected++;
                }
            });
        if (is_selected == 0) {
            validate = false;
            $("#question" + i)
                .find("div.input-group:first")
                .before(
                    '<label class="label-alert d-block"><small>Please select correct choice for the question</small></label>'
                );

            $("#submit").prop('disabled', false);


            $("#question" + i)
                .find("#question-title")
                .addClass("danger");

            $("#question" + i)
                .find("div.card-box")
                .removeClass("card-box")
                .addClass("card-box-alert");
            error = true;
        }
    }

    if (validate == true && error == false) {
        $('.question-section').hide();
        $('.question-footer').hide();
        $('.question_button').hide();

        $('.section-2').show();
        $('.section-2-footer').show();

        /* Create Question Section Here */
        for (var j = 1; j <= questionCount; j++) {

            var text_number = parseInt($("div.training-card-section").length);

            console.log(`text_number: ${text_number}`);

            /*  Get selected Answer */
            var correct = [];

            /* Looping for options */
            $("#question" + j)
                .find("div.option-div")
                .each(function(index, elem) {
                    var count = index + 1;

                    if (
                        $("#question" + j)
                        .find("#check" + count)
                        .is(":checked")
                    ) {
                        var opt_data = $(elem).find('input[id^="option"]').val();;

                        // if it is checked
                        correct.push(opt_data);
                    }
                });




            var question_inputs = $("#question" + j).find('div.card-box').clone();
            var question_text = $("#question" + j).find('#question-title').val();
            var correct_answer = correct.join(', ');

            var options_counter = numbertowords($('#question' + j).find('input[id^="option"]').length);

            $("form.sec1 div.section-2:visible div#root .card-box.training-card-section:last").after(`<div class="card-box card-bg card-border training-card-section section-div question-section-div">
                <div class="form-group">
                    <div class="hover-btn h-32">
                        <label><strong><span class="counter">${text_number}</span>. Question with <span class="option-counter"> ${options_counter} </span> option </strong> </label>
                        <button type="button" class="close remove-text" data-dismiss="alert">
                            <span aria-hidden="true">
                                <svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg" class="gt gs">
                                    <path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                    <path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                    <path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path>
                                    <path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                </svg>
                            </span>
                            <span class="sr-only">Close</span>
                        </button>
                    </div>
                    <div class="clearfix"></div>
                    <hr>
                </div>
                <label><strong class="question">${question_text}</strong></label>
                <p class="mb0">Correct Answer: <span class="correct-answer">${correct_answer}</span></p>
                <div class="question-inputs" id="quest-text-${text_number}" style="display:none">
                
                </div>
            </div>`);
            $('#quest-text-' + text_number).html(question_inputs);

            $("form.sec1 div.section-2:visible div#root .card-box.training-card-section").each(function(index, obj) {
                $(this).attr({ 'data-id': 'text-section-' + index });
                $(this).attr({ 'id': 'section-' + index });
                $(this).find('span.counter').text(index);
            });
        }
    }

    $('#question-done').prop('disabled', false);

});
/****************************  Manage Questions Ends ***************************/


/***********************************  Add Text *********************************/
/* Add Content */

$(document).on("click", '#add-content', function() {
    $(".slideup-content").slideToggle("slow", function() {

    });
});

$(document).on("click", ".show-setting", function() {
    $(".slideup-content").slideUp("slow", function() {});

    $(".section-1").hide();
    $(".section-1-footer").hide();
    $("form #setting").show();
});

$(document).on("click", "#back-text, #back-photo, #back-video, #back-document", function() {
    $(".slideup-content").slideUp("slow", function() {});

    $(".text-section").hide();
    $(".text-footer").hide();

    $(".section-2").show();
    $(".section-2-footer").show();

    $("form.sec1 div.section-2 div#root .card-box.training-card-section:last").remove();
});

/* Add Text */
$(document).on("click", "#add-text", function() {
    var text_number = parseInt($("div.training-card-section").length);
    var text_data = '';

    $(".slideup-content").slideUp("slow", function() {});

    $("#exampleModalCenter").modal("hide");

    $('.section-2').hide();
    $('.section-2-footer').hide();

    if ($('form.sec1 > div.text-section').length > 0) {
        $('form.sec1 > div.text-section').remove();
        $('form.sec1 > div.text-footer').remove();
    }

    $('form.sec1').append(add_text_section);
    $('form.sec1').append(add_text_footer);

    $("form.sec1 div.section-2 div#root .card-box.training-card-section:last").after(`
            <div class="card-box card-bg card-border training-card-section section-div text-section-div">
                <div class="form-group">
                    <div class="hover-btn h-32">
                        <label><strong><span class="counter">${text_number}</span>. <span class="type">Text</span></strong> </label>
                        <button type="button" class="close remove-text" data-dismiss="alert">
                            <span aria-hidden="true">
                                <svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg" class="gt gs">
                                    <path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                    <path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                    <path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path>
                                    <path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                </svg>
                            </span>
                            <span class="sr-only">Close</span>
                        </button>
                    </div>
                    <div class="clearfix"></div>
                    <hr>
                </div>
                <p class="mb0 text-description-preview">${text_data}</p>
                <textarea class="textarea-text" style="display:none">${text_data}</textarea>
            </div>`);
});

/* Submit Text */
$(document).on("click", "#text-done", function() {
    var text_number = parseInt($("div.training-card-section").length) - 1;
    console.log('text_number: ' + text_number);
    $(".slideup-content").slideUp("slow", function() {});

    var error_text = "";
    $("textarea").removeClass('danger');
    $("label.label-alert").remove();

    if ($("textarea#training-text").val().length <= 0) {
        $("textarea#training-text").before(`<label class="label-alert d-block">Required</label>`);
        $("textarea#training-text").focus();
        $("textarea#training-text").addClass('danger');
    } else {
        console.log(`text_number: ${text_number}`);
        var text_desc = $('textarea#training-text').val();
        $('.text-section').hide();
        $('.text-footer').hide();

        $('.section-2').show();
        $('.section-2-footer').show();

        $("form.sec1 div.section-2:visible div#root .card-box.training-card-section").each(function(index, obj) {
            $(this).attr({ 'data-id': 'text-section-' + index });
            $(this).attr({ 'id': 'section-' + index });
            $(this).find('span.counter').text(index);
        });

        $("#section-" + text_number).find('.textarea-text').val(text_desc);
        $("#section-" + text_number).find('.text-description-preview').text(text_desc);
    }
});

/* Add Photo */
$(document).on('click', '#add-photo', function() {
    var text_data = '';
    var text_number = parseInt($("div.training-card-section").length);
    $(".slideup-content").slideUp("slow", function() {});
    $("#exampleModalCenter").modal("hide");

    $('.section-2').hide();
    $('.section-2-footer').hide();

    if ($('form.sec1 > div.text-section').length > 0) {
        $('form.sec1 > div.text-section').remove();
        $('form.sec1 > div.text-footer').remove();
    }

    $("form.sec1 div.section-2 div#root .card-box.training-card-section:last").after(`
            <div class="card-box card-bg card-border training-card-section section-div photo-section-div">
                <div class="form-group">
                    <div class="row">
                        <div class="col-12">
                            <div class="hover-btn h-32">
                                <label>
                                    <strong><span class="counter">${text_number}</span>. <span class="type">Photo</span></strong> 
                                </label>
                                <button type="button" class="close remove-text" data-dismiss="alert">
                                    <span aria-hidden="true">
                                        <svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg" class="gt gs">
                                            <path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                            <path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                            <path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path>
                                            <path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                        </svg>
                                    </span>
                                    <span class="sr-only">Close</span>
                                </button>
                            </div>
                            <div class="clearfix"></div>
                            <hr>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-9">
                            <p class="mb0 photo-description-preview">${text_data}</p>                    
                        </div>
                        <div class="col-3">
                            <div class="img-thumbnail">
                                <img id="image-sec-${text_number}">                
                            </div>
                        </div>
                    </div>
                </div>
                <textarea class="textarea-photo-description" style="display:none">${text_data}</textarea>
                <input type="file" id="upload-photo" class="in-t form-control" accept="image/*" src="images/px-img.png" style="display:none" multiple>
            </div>`);

    $('form.sec1').append(add_photo_section);
    $('form.sec1').append(add_photo_footer);
    $('#upload-photo').click();
});

/* Submit Photo */
$(document).on("click", "#photo-done", function() {
    var text_number = parseInt($("div.training-card-section").length) - 1;
    $(".slideup-content").slideUp("slow", function() {});
    console.log('text_number: ' + text_number);

    var error_text = "";
    $("input[type='file']#upload-photo").removeClass('danger');
    $("label.label-alert").remove();

    if ($("input[type='file']#upload-photo").val().length <= 0) {
        if ($("input[type='file']#upload-photo").val().length <= 0) {
            $("input[type='file']#upload-photo").before(`<label class="label-alert d-block">Required</label>`);
            $("input[type='file']#upload-photo").focus();
            $("input[type='file']#upload-photo").addClass('danger');
        }
    } else {
        var photo_desc = $('textarea#photo-description').val();
        $('.text-section').hide();
        $('.text-footer').hide();

        $('.section-2').show();
        $('.section-2-footer').show();


        $("form.sec1 div.section-2:visible div#root .card-box.training-card-section").each(function(index, obj) {
            $(this).attr({ 'data-id': 'text-section-' + index });
            $(this).attr({ 'id': 'section-' + index });
            $(this).find('span.counter').text(index);
        });

        /* File reader */
        var input = $("input[type='file']#upload-photo")[0];
        if (input.files) {
            var filesAmount = input.files.length;

            var count = 0;
            for (var j = 0; j < filesAmount; j++) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    if (count == 0) {
                        console.log("#section-" + text_number);
                        $("#section-" + text_number).find("#image-sec-" + text_number).attr({ "src": event.target.result });

                        if (filesAmount > 1)
                            $("#section-" + text_number).find("#image-sec-" + text_number).after(`<span class="file-counter">+${filesAmount-1}</span>`);
                    }
                    count++;
                }
                reader.readAsDataURL(input.files[j]);
            }
        }
        $("#section-" + text_number).find('.textarea-photo-description').val(photo_desc);
        $("#section-" + text_number).find('.photo-description-preview').text(photo_desc);
    }
});

/* Add Video */
$(document).on('click', '#add-video', function() {
    var text_number = parseInt($("div.training-card-section").length);
    var text_data = '';

    $(".slideup-content").slideUp("slow", function() {});
    $("#exampleModalCenter").modal("hide");

    $('.section-2').hide();
    $('.section-2-footer').hide();

    if ($('form.sec1 > div.text-section').length > 0) {
        $('form.sec1 > div.text-section').remove();
        $('form.sec1 > div.text-footer').remove();
    }

    $('form.sec1').append(add_video_section);
    $('form.sec1').append(add_video_footer);
    $('#upload-video').click();

    $("form.sec1 div.section-2 div#root .card-box.training-card-section:last").after(`
        <div class="card-box card-bg card-border training-card-section section-div video-section-div">
            <div class="form-group">
                <div class="hover-btn h-32">
                    <label>
                        <strong><span class="counter">${text_number}</span>. <span class="type">Video</span></strong> 
                    </label>
                    <button type="button" class="close remove-text" data-dismiss="alert">
                        <span aria-hidden="true">
                            <svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg" class="gt gs">
                                <path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                <path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                                <path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path>
                                <path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                            </svg>
                        </span>
                        <span class="sr-only">Close</span>
                    </button>
                </div>
                <div class="clearfix"></div>
                <hr>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="embed-responsive embed-responsive-21by9">
                            <video controls class="video" id="video-sec-${text_number}">
                            </video>
                        </div>        
                    </div>
                    <div class="col-sm-12">
                        <p class="mb0 video-description-preview">${text_data}</p>
                    </div>
                </div>
            </div>
            <textarea class="textarea-video" style="display:none">${text_data}</textarea>
            <input type="file" id="upload-video" accept="video/*" src="images/px-img.png" style="width:100%; height: 180px; display: none;">  
        </div>`);

});

/* Submit Video */
$(document).on("click", "#video-done", function() {
    var text_number = parseInt($("div.training-card-section").length) - 1;
    var video_desc = $('textarea#video-description').val();
    $(".slideup-content").slideUp("slow", function() {});
    console.log('text_number: ' + text_number);

    var error_text = "";
    $("textarea").removeClass('danger');
    $("label.label-alert").remove();

    if ($("input[type='file']#upload-video")[0].files[0].name.length <= 0) {
        $("input[type='file']#upload-video").before(`<label class="label-alert d-block">Required</label>`);
        $("input[type='file']#upload-video").focus();
        $("input[type='file']#upload-video").addClass('danger');
    } else {
        $('.text-section').hide();
        $('.text-footer').hide();

        $('.section-2').show();
        $('.section-2-footer').show();

        $("form.sec1 div.section-2:visible div#root .card-box.training-card-section").each(function(index, obj) {
            $(this).attr({ 'data-id': 'text-section-' + index });
            $(this).attr({ 'id': 'section-' + index });
            $(this).find('span.counter').text(index);
        });
        // readURL($("input[type='file']#upload-video")[0], "#image-sec-" + text_number);

        var fileInput = document.getElementById('upload-video');
        var fileUrl = window.URL.createObjectURL(fileInput.files[0]);
        $("#section-" + text_number).find("#video-sec-" + text_number).attr("src", fileUrl);
        $("#section-" + text_number).find('textarea.textarea-video').val(video_desc);
        $("#section-" + text_number).find('.video-description-preview').text(video_desc);
    }
});

/* Add Document */
$(document).on('click', '#add-document', function() {
    var text_number = parseInt($("div.training-card-section").length);
    var text_data = '';
    $(".slideup-content").slideUp("slow", function() {});
    $("#exampleModalCenter").modal("hide");

    $('.section-2').hide();
    $('.section-2-footer').hide();

    if ($('form.sec1 > div.text-section').length > 0) {
        $('form.sec1 > div.text-section').remove();
        $('form.sec1 > div.text-footer').remove();
    }

    $("form.sec1 div.section-2 div#root .card-box.training-card-section:last").after(`
    <div class="card-box card-bg card-border training-card-section section-div document-section-div">
        <div class="form-group">
            <div class="hover-btn h-32">
                <label>
                    <strong><span class="counter">${text_number}</span>. <span class="type">Document</span></strong> 
                </label>
                <button type="button" class="close remove-text" data-dismiss="alert">
                    <span aria-hidden="true">
                        <svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg" class="gt gs">
                            <path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                            <path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                            <path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path>
                            <path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path>
                        </svg>
                    </span>
                    <span class="sr-only">Close</span>
                </button>
            </div>
            <div class="clearfix"></div>
            <hr>
        </div>
        <div class="row">
            <div class="col-9">
                <p class="mb0 document-description-preview">${text_data}</p>                    
            </div>
            <div class="col-3">
                <div class="img-thumbnail">
                    <img id="image-sec-${text_number}">                
                </div>
            </div>
        </div>
        <textarea class="textarea-document" style="display:none">${text_data}</textarea>
        <input type="file" id="upload-document" accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf" src="images/px-img.png" style="width:100%; height: 180px; display:none">
    </div>`);

    $('form.sec1').append(add_document_section);
    $('form.sec1').append(add_document_footer);
    $('#upload-document').click();
});

/* Submit Document */
$(document).on("click", "#document-done", function() {
    var text_number = parseInt($("div.training-card-section").length) - 1;
    $(".slideup-content").slideUp("slow", function() {});
    console.log('text_number: ' + text_number);

    var error_text = "";
    $("textarea").removeClass('danger');
    $("label.label-alert").remove();

    if ($("input[type='file']#upload-document").val().length <= 0) {
        if ($("input[type='file']#upload-document").val().length <= 0) {
            $("input[type='file']#upload-document").before(`<label class="label-alert d-block">Required</label>`);
            $("input[type='file']#upload-document").focus();
            $("input[type='file']#upload-document").addClass('danger');
        }
    } else {
        console.log(`text_number: ${text_number}`);

        $('.text-section').hide();
        $('.text-footer').hide();

        $('.section-2').show();
        $('.section-2-footer').show();


        $("form.sec1 div.section-2:visible div#root .card-box.training-card-section").each(function(index, obj) {
            $(this).attr({ 'data-id': 'text-section-' + index });
            $(this).attr({ 'id': 'section-' + index });
            $(this).find('span.counter').text(index);
        });

        $('#section-' + text_number).find('textarea.textarea-document').val($('#document-description').val());
        $('#section-' + text_number).find('.document-description-preview').text($('#document-description').val());

        // readURL($("input[type='file']#upload-photo")[0], "#image-sec-" + text_number);
        $("#section-" + text_number).find("#image-sec-" + text_number).attr('src', 'images/doc.png');
        $("#section-" + text_number).find("#image-sec-" + text_number).parents('div.img-thumbnail').after('<span class="doc-name">' + $("input[type='file']#upload-document")[0].files[0].name + '</span>');
    }
});

$(document).on('change', '#upload-photo', function() {
    // readURL(this, '#photo-image-preview');
    if (imagesPreview(this, '.updated-img')) {
        $('.photo-box').hide();
        $('.change-link').show();
        $('.updated-img').show();
    }
})

var imagesPreview = function(input, placeToInsertImagePreview) {

    if (input.files) {
        var filesAmount = input.files.length;

        if (filesAmount > 10) {
            var svg = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="gt gs mt--4"><g><g><g><path d="M507.113,428.415L287.215,47.541c-6.515-11.285-18.184-18.022-31.215-18.022c-13.031,0-24.7,6.737-31.215,18.022L4.887,428.415c-6.516,11.285-6.516,24.76,0,36.044c6.515,11.285,18.184,18.022,31.215,18.022h439.796c13.031,0,24.7-6.737,31.215-18.022C513.629,453.175,513.629,439.7,507.113,428.415z M481.101,449.441c-0.647,1.122-2.186,3.004-5.202,3.004H36.102c-3.018,0-4.556-1.881-5.202-3.004c-0.647-1.121-1.509-3.394,0-6.007L250.797,62.559c1.509-2.613,3.907-3.004,5.202-3.004c1.296,0,3.694,0.39,5.202,3.004L481.1,443.434C482.61,446.047,481.748,448.32,481.101,449.441z"/><rect x="240.987" y="166.095" width="30.037" height="160.197" /><circle cx="256.005" cy="376.354" r="20.025" /></g></g></g > <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg >';
            var title = 'Notice!';
            var msg = 'Maximum 10 images allowed at a time';
            showAlert(svg, title, msg);
            return false;
        }

        $('.updated-img').html('');
        var $carousel = $('<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel"></div>');
        var $ol_section = $('<ol class="carousel-indicators"></ol>');
        var $carousel_inner = $('<div class="carousel-inner"></div>');

        $carousel.append($ol_section);
        $carousel.append($carousel_inner);

        var count = 0;
        for (var i = 0; i < filesAmount; i++) {
            var reader = new FileReader();
            var $li_list = $(`<li data-target="#carouselExampleIndicators" data-slide-to="${i}" class="${i == 0 ? 'active': ''}"></li>`);
            $ol_section.append($li_list);

            reader.onload = function(event) {

                var $img_div = $(`<div class="carousel-item ${count == 0 ? 'active' : ''}">
                                    <img class="d-block w-100" src="${event.target.result}" alt="${count+1} slide">
                                </div>`);
                $carousel_inner.append($img_div);
                count++;
                // $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
            }

            reader.readAsDataURL(input.files[i]);
        }
        $carousel.append(`<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>`);
        $(placeToInsertImagePreview).append($carousel);
        $('.carousel').carousel();
        return true;
    }
    return false;
};

$(document).on('click', '.carousel-control-prev', function() {

    $('.carousel').carousel('prev')
});

$(document).on('click', '.carousel-control-next', function() {

    $('.carousel').carousel('next')
});

$(document).on('change', '#upload-video', function() {
    // readURL(this, '#video-section-preview');
    var fileInput = document.getElementById('upload-video');
    var fileUrl = window.URL.createObjectURL(fileInput.files[0]);
    $('.updated-video').show();
    $('.change-link').show();
    $('.video-box').hide();
    $(".video-section-preview").last().attr("src", fileUrl);
});

$(document).on('change', '#upload-document', function() {
    if ($(this)[0].files[0].name != undefined || $(this)[0].files[0].name != null)
        $('.doc-name').html('');
    $('.doc-name').append(`<a>${$(this)[0].files[0].name}</a>`);
    // readURL(this, '#document-section-preview');
});

$(document).on("click", ".remove-text", function() {
    var element = '';
    var data_id = $(this).parents('.card-box').attr('data-id');

    $("#exampleModalCenter")
        .find("#exampleModalLongTitle")
        .html('<svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg" class="gt gs mt--4">< path d = "m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" ></path ><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path></svg > Delete?');
    $("#exampleModalCenter")
        .find(".modal-body")
        .html("Are you sure you want to delete?");
    $("#exampleModalCenter")
        .find(".modal-footer")
        .html(
            `<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Close</button>
            <button data-id="${data_id}" type="button" class="btn btn-primary" id="confirm-delete-text">Ok</button>`
        );
    $("#exampleModalCenter").modal("show");

    element = $(this);

});

$(document).on("click", "#confirm-delete-text", function() {
    var eve = $(this).attr('data-id');

    $('div.card-box[data-id="' + eve + '"]').remove();
    $("form.sec1 div.section-2:visible div#root .card-box.training-card-section").each(function(index, obj) {
        $(this).find('span.counter').text(index);
        $(this).attr("data-id", "text-section-" + index);
        if ($(this).find('div.question-inputs').length > 0) {
            $(this).find('div.question-inputs').attr('id', 'quest-text-' + index);
        }
    });

    $("#exampleModalCenter").modal("hide");

});


$(document).on("click", "#next", function() {
    $(".slideup-content").slideUp("slow", function() {});

    /* Validate */
    var error_text = "";
    var question_number = 0;

    $("form")
        .find("input[type='text']")
        .each(function() {
            var element = $(this);
            if (element.val() == "") {
                validate = false;
                if (element.attr("id").startsWith("question-title")) {
                    console.log("question_number.length" + question_number.length);
                    if (
                        question_number !=
                        element
                        .parents("div.form-group")
                        .find("span.question-number")
                        .text()
                    ) {
                        question_number = element
                            .parents("div.form-group")
                            .find("span.question-number")
                            .text();
                        error_text += "<h6><u>Question " + question_number + "</u> </h6>";
                    }

                    error_text += "<p>Question is required. </p>";
                } else if (element.attr("id").startsWith("option")) {
                    if (
                        question_number !=
                        element.parents("div.card").find("span.question-number").text()
                    ) {
                        question_number = element
                            .parents("div.card")
                            .find("span.question-number")
                            .text();
                        error_text += "<h6><u>Question " + question_number + "</u> </h6>";
                    }

                    error_text +=
                        "<p>Blank option not allowed for " +
                        element.attr("placeholder") +
                        ".</p>";
                }
            }
        });

    console.log("error_text.length: " + error_text.length);
    if ($.trim(error_text).length <= 0) {
        $(".section-1").hide();
        $("form").append($("#setting").clone());
        $("form #setting").show();
    } else {
        // alert(error_text);
        $("#exampleModalCenter")
            .find("#exampleModalLongTitle")
            .html('<img src="images/error.png"/> Error!');
        $("#exampleModalCenter").find(".modal-body").html(error_text);
        $("#exampleModalCenter")
            .find(".modal-footer")
            .html(
                '<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Close</button>'
            );
        $("#exampleModalCenter").find("#save-changes").hide();

        $("#exampleModalCenter").modal("show");
    }
});
/********************************  Add Text Ends *************************************/


/***********************************  Submit Training *********************************/
$(document).on("click", "#submit", function() {
    $(".slideup-content").slideUp("slow", function() {});

    $("#submit").prop('disabled', true);
    submitForm();
});

/* Async method for fetching localization strings */
async function getStringKeys() {
    Localizer.getString('quizTitle').then(function(result) {
        $('#quiz-title').attr({ 'placeholder': result });
    });

    Localizer.getString('quizDescription').then(function(result) {
        $('#quiz-description').attr({ 'placeholder': result });
    });

    Localizer.getString('enterTheQuestion').then(function(result) {
        $('#question-title').attr({ 'placeholder': result });
        questionTitleKey = result;
    });

    Localizer.getString('option', '').then(function(result) {
        optionKey = result;
    });
    Localizer.getString('dueIn', ' 1 week', ', Results visible to everyone', ', Correct answer shown after every question').then(function(result) {
        setting_text = result;
        $('#due').text(setting_text);
    });

    Localizer.getString('addMoreOptions').then(function(result) {
        addMoreOptionsKey = result;
        $('.add-options').html(`<svg role="presentation" focusable="false" viewBox="8 8 16 16" class="cc gs gt tc gv">
            <path class="ui-icon__outline cc" d="M23.352 16.117c.098.1.148.217.148.352 0 .136-.05.253-.148.351a.48.48 0 0 1-.352.149h-6v6c0 .136-.05.253-.148.351a.48.48 0 0 1-.352.149.477.477 0 0 1-.352-.149.477.477 0 0 1-.148-.351v-6h-6a.477.477 0 0 1-.352-.149.48.48 0 0 1-.148-.351c0-.135.05-.252.148-.352A.481.481 0 0 1 10 15.97h6v-6c0-.135.049-.253.148-.352a.48.48 0 0 1 .352-.148c.135 0 .252.05.352.148.098.1.148.216.148.352v6h6c.135 0 .252.05.352.148z">
            </path>
            <path class="ui-icon__filled gr" d="M23.5 15.969a1.01 1.01 0 0 1-.613.922.971.971 0 0 1-.387.078H17v5.5a1.01 1.01 0 0 1-.613.922.971.971 0 0 1-.387.078.965.965 0 0 1-.387-.079.983.983 0 0 1-.535-.535.97.97 0 0 1-.078-.386v-5.5H9.5a.965.965 0 0 1-.387-.078.983.983 0 0 1-.535-.535.972.972 0 0 1-.078-.387 1.002 1.002 0 0 1 1-1H15v-5.5a1.002 1.002 0 0 1 1.387-.922c.122.052.228.124.32.215a.986.986 0 0 1 .293.707v5.5h5.5a.989.989 0 0 1 .707.293c.09.091.162.198.215.32a.984.984 0 0 1 .078.387z">
            </path>
        </svg> ${addMoreOptionsKey}`);
    });

    Localizer.getString('choices').then(function(result) {
        choicesKey = result;
        $('.choice-label').text(choicesKey);
    });

    Localizer.getString('checkMe').then(function(result) {
        checkMeKey = result;
        $('.check-me').text(checkMeKey);
        $('.check-me-title').attr({ "title": checkMeKey });
    });

    Localizer.getString('next').then(function(result) {
        nextKey = result;
        $('.next-key').text(nextKey);
    });

    Localizer.getString('back').then(function(result) {
        backKey = result;
        $('.back-key').text(backKey);
    });

    Localizer.getString('required').then(function(result) {
        requiredKey = result;
        $('.required-key').text(requiredKey);
    });

    Localizer.getString('dueBy').then(function(result) {
        dueByKey = result;
        $('.due-by-key').text(dueByKey);
    });

    Localizer.getString('resultVisibleTo').then(function(result) {
        resultVisibleToKey = result;
        $('.result-visible-key').text(resultVisibleToKey);
    });

    Localizer.getString('resultEveryone').then(function(result) {
        resultEveryoneKey = result;
    });

    Localizer.getString('resultMe').then(function(result) {
        resultMeKey = result;
    });

    Localizer.getString('correctAnswer', ', ').then(function(result) {
        correctAnswerKey = result;
    });

    Localizer.getString('everyone', ', ').then(function(result) {
        everyoneKey = result;
        $('.everyone-key').text(everyoneKey);
    });

    Localizer.getString('onlyMe', ', ').then(function(result) {
        onlyMeKey = result;
        $('.onlyme-key').text(onlyMeKey);
    });

    Localizer.getString('showCorrectAnswer').then(function(result) {
        showCorrectAnswerKey = result;
        $('.show-correct-key').text(showCorrectAnswerKey);
    });

    Localizer.getString('answerCannotChange').then(function(result) {
        answerCannotChangeKey = result;
        $('.answer-cannot-change-key').text(answerCannotChangeKey);
    });
}

function submitForm() {
    actionSDK
        .executeApi(request)
        .then(function(response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            createAction(response.context.actionPackageId);
        })
        .catch(function(error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        });
}

function getQuestionSet() {
    questions = new Array();

    $("form div.section-2 #root").find('.section-div').each(function(index, elem) {
        if ($(elem).hasClass("question-section-div") == true) {
            /* Get Questions */
            var option_type = actionSDK.ActionDataColumnValueType.SingleOption;
            var question_id = $(elem).find('span.counter').text();
            let option = [];

            $(elem).find("div.option-div").each(function(ind, e) {
                var count = ind + 1;
                var opt_id = "question" + question_id + "option" + count;
                var opt_title = $("div.section-2 #quest-text-" + question_id).find("#option" + count).val();

                if ($("div.section-2 #quest-text-" + question_id).find("input[type=checkbox]:checked").length > 1) {
                    console.log("multiselect");
                    option_type = actionSDK.ActionDataColumnValueType.MultiOption;
                } else {
                    console.log("singleselect");
                    option_type = actionSDK.ActionDataColumnValueType.SingleOption;
                }
                option.push({ name: opt_id, displayName: opt_title });
            });

            var val = {
                name: question_id.toString(),
                displayName: $("div.section-2 #quest-text-" + question_id).find("#question-title").val(),
                valueType: option_type,
                allowNullValue: false,
                options: option,
            };


            questions.push(val);

        } else if ($(elem).hasClass("text-section-div") == true) {

            /*  Get Text  */
            var option_type = actionSDK.ActionDataColumnValueType.LargeText;
            let option = [];
            var opt_id = $(elem).find('span.counter').text();
            var opt_title = $(elem).find('textarea').val();
            console.log(`name: ${opt_id}, displayName: ${opt_title}`);
            option.push({ name: opt_id, displayName: opt_title });

            var val = {
                name: opt_id.toString(),
                displayName: opt_title,
                valueType: option_type,
                allowNullValue: false,
                options: option,
            };

            questions.push(val);
        } else if ($(elem).hasClass("photo-section-div") == true) {
            /* Photo */
            let image_counter = $(elem).find('input[type="file"]').get(0).files.length;
            let attachment_request = '';
            for (let i = 0; i < image_counter; i++) {
                var file_data = $(elem).find('input[type="file"]').get(0).files[i];
                var reader = new FileReader();
                reader.onload = function(event) {
                    var blob = event.target.result
                    var attachment = actionSDK.AttachmentUtils.creatBlobAttachmentData(blob, file_data['type']);
                    attachment_request = new actionSDK.UploadAttachment.Request(attachment, function(status) {
                        console.log("Status: " + status);
                    });
                }
                reader.readAsText(file_data);
            }

            actionSDK.executeApi(attachment_request)
                .then(function(response) {
                    attachmentId = response.attachmentId;
                    console.log("response = " + response);

                    var option_type = actionSDK.ActionDataColumnValueType.LargeText;
                    let option = [];
                    var opt_id = $(elem).find('span.counter').text();
                    var opt_title = $(elem).find('textarea').val();
                    console.log(`name: ${opt_id}, displayName: ${opt_title}`);
                    option.push({ name: opt_id, displayName: opt_title });

                    var val = {
                        name: opt_id.toString(),
                        displayName: opt_title,
                        valueType: option_type,
                        allowNullValue: false,
                        options: option,
                    };

                    questions.push(val);
                });


        }
    });
    return questions;
}

function getCorrectAnswer() {
    let correct_option = [];

    $("form div.section-2 #root").find('.section-div').each(function(index, elem) {
        var correct = [];
        var question_id = $(elem).find('span.counter').text();
        if ($(elem).hasClass("question-section-div") == true) {
            $(elem).find("div.option-div").each(function(ind, e) {
                var count = ind + 1;

                if ($(elem).find("#quest-text-" + question_id + " #check" + count).is(":checked")) {
                    var opt_id = "question" + question_id + "option" + count;

                    // if it is checked
                    correct.push(opt_id);
                }
            });
        } else if ($(elem).hasClass("text-section-div") == true) {
            var opt_id = "question" + question_id;
            correct.push(opt_id);
        }
        correct_option[question_id - 1] = correct;
    });

    var property = {
        name: "Question Answers",
        type: "LargeText",
        value: JSON.stringify(correct_option),
    };

    return property;

    for (var i = 1; i <= questionCount; i++) {

        var correct = [];

        /* Looping for options */
        $("div.section-2  #question" + i)
            .find("div.option-div")
            .each(function(index, elem) {
                var count = index + 1;

                if (
                    $("div.section-2  #question" + i)
                    .find("#check" + count)
                    .is(":checked")
                ) {
                    var opt_id = "question" + i + "option" + count;

                    // if it is checked
                    correct.push(opt_id);
                }
            });
        correct_option[i - 1] = correct;
    }
    var property = {
        name: "Question Answers",
        type: "LargeText",
        value: JSON.stringify(correct_option),
    };

    return property;
}

function createAction(actionPackageId) {
    var trainingTitle = $("#training-title").val();
    var trainingDescription = $("#training-description").val();
    console.log(`trainingTitle: ${trainingTitle} : trainingDescription: ${trainingDescription}`);
    var trainingExpireDate = $("#expiry-date").val();
    var trainingExpireTime = $("#expiry-time").val();
    var resultVisible = $("input[name='visible_to']:checked").val();
    var showCorrectAnswer = $("#show-correct-answer").is(":checked") ?
        "Yes" :
        "No";
    var questionsSet = getQuestionSet();
    var getcorrectanswers = getCorrectAnswer();

    if (questionsSet.length <= 0) {
        return;
    }

    var properties = [];
    properties.push({
        name: "Training Description",
        type: "LargeText",
        value: trainingDescription,
    }, {
        name: "Training Expire Date Time",
        type: "DateTime",
        value: new Date(trainingExpireDate + " " + trainingExpireTime),
    }, {
        name: "Result Visible",
        type: "Text",
        value: resultVisible,
    }, {
        name: "Show Correct Answer",
        type: "Text",
        value: showCorrectAnswer,
    });
    properties.push(getcorrectanswers);
    console.log(properties);
    console.log("resultVisible: " + resultVisible);
    var action = {
        id: generateGUID(),
        actionPackageId: actionPackageId,
        version: 1,
        displayName: trainingTitle,
        description: trainingDescription,
        expiryTime: new Date(trainingExpireDate + " " + trainingExpireTime).getTime(),
        customProperties: properties,
        dataTables: [{
            name: "TestDataSet",
            itemsVisibility: actionSDK.Visibility.All,
            rowsVisibility: resultVisible == "Everyone" ?
                actionSDK.Visibility.All : actionSDK.Visibility.Sender,
            itemsEditable: false,
            canUserAddMultipleItems: false,
            dataColumns: questionsSet,
        }, ],
    };
    console.log("action: ");
    console.log(JSON.stringify(action));

    var request = new actionSDK.CreateAction.Request(action);
    actionSDK
        .executeApi(request)
        .then(function(response) {
            console.info("CreateAction - Response: " + JSON.stringify(response));
        })
        .catch(function(error) {
            console.error("CreateAction - Error: " + JSON.stringify(error));
        });
}

function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/***********************************  Submit Training Ends *******************************/


$(document).ready(function() {
    request = new actionSDK.GetContext.Request();
    getStringKeys();
    getTheme();
    console.log('setting_text ' + setting_text);

});

async function getTheme() {
    let response = await actionSDK.executeApi(request);
    let context = response.context;

    var theme = context.theme;
    $("link#theme").attr("href", "css/style-" + theme + ".css");


    $('form.sec1').append(form_section);
    $('form.sec1').append(setting_section);
    $('form.sec1').append(training_section_view);
    $('form.sec1').after(option_section);
    $('form.sec1').after(modal_section);
    $('form.sec1').after(toggle_section);


    // question_section = $("#question-section div.container").clone();
    opt = $("div#option-section .option-div").clone();

    let week_date = new Date(new Date().setDate(new Date().getDate() + 7))
        .toISOString()
        .split("T")[0];

    let week_month = new Date(week_date).toLocaleString('default', { month: 'short' });
    let week_d = new Date(week_date).getDate();
    let week_year = new Date(week_date).getFullYear();
    let week_date_format = week_month + " " + week_d + ", " + week_year;

    let current_time = (("0" + new Date().getHours()).substr(-2)) + ":" + (("0" + new Date().getMinutes()).substr(-2));

    $('.form_date input').val(week_date_format);
    $(".form_date").attr({ "data-date": week_date_format });

    $('.form_time').datetimepicker({
        language: 'en',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 1,
        minView: 0,
        maxView: 1,
        forceParse: 0
    });

    $('.form_time input').val(current_time);


    let date_input = $('input[name="expiry_date"]');
    let container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    let options = {
        format: 'M dd, yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
        orientation: 'top'
    };
    date_input.datepicker(options);

    await actionSDK.executeApi(new actionSDK.HideLoadingIndicator.Request());

    setTimeout(() => {
        $("form.sec1").show();
        $(".section-1").show();
        $(".section-1-footer").show()
    }, 1000);
}

/***********************************  Other Actions *******************************/

$(document).on("click", "#back", function() {
    $(".slideup-content").slideUp("slow", function() {});

    $(".section-2").hide();
    $(".section-2-footer").hide();

    $(".section-1").show();
    $(".section-1-footer").show();
});

$(document).on("click", "#back-setting", function() {
    $(".slideup-content").slideUp("slow", function() {});

    $(".section-1").show();
    $(".section-1-footer").show();

    $("form #setting").hide();
    console.log('setting_text ' + setting_text);
    $('#due').text(setting_text);
});


$(document).on('click', '#next1', function() {
    $(".slideup-content").slideUp("slow", function() {});
    $("input[type='text']").removeClass("danger");
    $("label.label-alert").remove();
    $("div.card-box-alert").removeClass("card-box-alert").addClass("card-box");

    $("form > .section-1")
        .find("input[type='text']")
        .each(function() {
            var element = $(this);
            if (element.val() == "") {
                validate = false;

                $(this)
                    .parents("div.card-box")
                    .removeClass("card-box")
                    .addClass("card-box-alert");

                if (element.attr("id") == "training-title") {
                    $("#training-title").addClass("danger");
                    $("#training-title").before(`<label class="label-alert d-block"><small>Required</small></label>`);
                }
                if (element.attr("id") == "training-description") {
                    $("#training-description").addClass("danger");
                    $("#training-description").before(`<label class="label-alert d-block"><small>Required</small></label>`);
                }
            } else {
                $('.section-1').hide();
                $('div.section-1-footer').hide();

                $('.section-2').show();
                $('div.section-2-footer').show();

                $('#training-title-content').text($('#training-title').val());
                $('#training-description-content').text($('#training-description').val());
                $('#cover-image').after('<textarea name="training_title" class="training-title" style="display:none">' + $('#training-title').val() + '</textarea>')
                $('#cover-image').after('<textarea name="training_description" class="training-description" style="display:none">' + $('#training-description').val() + '</textarea>')
            }
        });

    let image_counter = $(".training-card-section").find('input[type="file"]').get(0).files.length;
    let attachment_request = '';
    for (let i = 0; i < image_counter; i++) {
        var file_data = $(".training-card-section").find('input[type="file"]').get(0).files[i];
        var reader = new FileReader();
        reader.onload = function(event) {
            var blob = event.target.result
            var attachment = actionSDK.AttachmentUtils.creatBlobAttachmentData(blob, file_data['type']);
            attachment_request = new actionSDK.UploadAttachment.Request(attachment, function(status) {
                // console.log("Status: " + status);
            });
            console.log(`attachment_request: ${JSON.stringify(attachment_request)}`);
            actionSDK.executeApi(attachment_request)
                .then(function(response) {
                    attachmentId = response.attachmentId;
                    console.log("response = " + response);
                    console.log("attachmentId = " + attachmentId);
                }).catch(function(error) {
                    console.log("GetContext - Error: " + JSON.stringify(error));
                });

        }
        reader.readAsText(file_data);
    }

    /* 
     */



});


$(document).on('change', '#cover-image', function() {
    readURL(this, '#training-img-preview, #training-title-image');
    $('.photo-box').hide();
    $('.img-thumbnail').show();
    $('.updated-img').show();
    $('#training-title-image').show();
});

$(document).on('click', '.upvj', function(event) {
    event.preventDefault();
    $('.section-2').find('div.card-box:last').find('input[type="file"]').click();
})


/***********************************  Other Actions Ends ***************************/


/***********************************  Settings ***************************/

$(document).on("change", "#expiry-date, #expiry-time, .visible-to", function() {
    var end = new Date($('input[name="expiry_date"]').val() + ' ' + $('input[name="expiry_time"]').val());
    var start = new Date();
    var days = calc_date_diff(start, end);

    if (days == undefined) {

        $("#exampleModalCenter")
            .find("#exampleModalLongTitle")
            .html('<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="gt gs mt--4"><g><g><g><path d="M507.113,428.415L287.215,47.541c-6.515-11.285-18.184-18.022-31.215-18.022c-13.031,0-24.7,6.737-31.215,18.022L4.887,428.415c-6.516,11.285-6.516,24.76,0,36.044c6.515,11.285,18.184,18.022,31.215,18.022h439.796c13.031,0,24.7-6.737,31.215-18.022C513.629,453.175,513.629,439.7,507.113,428.415z M481.101,449.441c-0.647,1.122-2.186,3.004-5.202,3.004H36.102c-3.018,0-4.556-1.881-5.202-3.004c-0.647-1.121-1.509-3.394,0-6.007L250.797,62.559c1.509-2.613,3.907-3.004,5.202-3.004c1.296,0,3.694,0.39,5.202,3.004L481.1,443.434C482.61,446.047,481.748,448.32,481.101,449.441z"/><rect x="240.987" y="166.095" width="30.037" height="160.197" /><circle cx="256.005" cy="376.354" r="20.025" /></g></g></g > <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg > Notice!');
        $("#exampleModalCenter")
            .find(".modal-body")
            .html("<p><strong>Invalid Date or Time!</strong></p><p>It must be greater than current date and time.</p>");
        $("#exampleModalCenter")
            .find(".modal-footer")
            .html(
                '<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Close</button>'
            );
        $("#exampleModalCenter").modal("show");
    } else {
        var result_visible = $('.visible-to:checked').val() == 'Everyone' ? 'Results visible to everyone' : 'Results visible to only me';
        console.log('due: ' + days + ', ' + result_visible);
        setting_text = ' Due in ' + days + ', ' + result_visible;
    }
});

/********************************  Settings Ends ***********************/


/***********************************  Methods ***************************/

function calc_date_diff(start, end) {
    var days = (end - start) / (1000 * 60 * 60 * 24);
    console.log('days: ' + days);
    if (days > 6) {
        var weeks = Math.ceil(days) / 7;
        return Math.floor(weeks) + ' week';
    } else {
        if (days < 1) {
            var t1 = start.getTime();
            var t2 = end.getTime();

            var minsDiff = Math.floor((t2 - t1) / 1000 / 60);
            var hourDiff = Math.floor(minsDiff / 60);
            minsDiff = minsDiff % 60;

            if (hourDiff > 1) {
                var hourText = 'hours';
            } else {
                var hourText = 'hour';
            }
            if (hourDiff > 1) {
                var minuteText = 'minutes';
            } else {
                var minuteText = 'minute';
            }
            if (hourDiff > 0 && minsDiff > 0) {
                return hourDiff + ' ' + hourText + ', ' + minsDiff + ' ' + minuteText;
            } else if (hourDiff > 0 && minsDiff <= 0) {
                return hourDiff + ' ' + hourText;
            } else if (hourDiff <= 0 && minsDiff > 0) {
                return minsDiff + ' ' + minuteText;
            }
        } else {
            return Math.ceil(days) + ' days';
        }
    }
}

function numbertowords(num) {
    switch (num) {
        case 1:
            return "one";
            break;
        case 2:
            return "two";
            break;
        case 3:
            return "three";
            break;
        case 4:
            return "four";
            break;
        case 5:
            return "five";
            break;
        case 6:
            return "six";
            break;
        case 7:
            return "seven";
            break;
        case 8:
            return "eight";
            break;
        case 9:
            return "nine";
            break;
        case 10:
            return "ten";
            break;
        default:
            break;
    }
}

function readURL(input, elem) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $(elem).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}

function showAlert(svg, title, message) {
    $("#exampleModalCenter")
        .find("#exampleModalLongTitle")
        .html(`${svg} ${title}`);
    $("#exampleModalCenter")
        .find(".modal-body")
        .html(`${message}`);
    $("#exampleModalCenter")
        .find(".modal-footer")
        .html(
            `<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Close</button>`
        );
    $("#exampleModalCenter").modal("show");
}
/***********************************  Methods Ends ***************************/


/***********************************  HTML Section ***************************/

/*  HTML Sections  */
// form
var form_section = `<div class="section-1" style="display:none">
            <div class="container pt-4">
                <div id="root" class="card-box card-border card-bg">
                    <div class="form-group">
                        <input type="Text" placeholder="Training Title" class="in-t input-lg form-control"
                            id="training-title" />
                    </div>
                    <div class="form-group">
                        <input type="Text" placeholder="Training Description" class="in-t form-control"
                            id="training-description" />
                    </div>
                    <div class="form-group">
                        <label>Cover Image (Optional)</label>
                        <div class="relative">
                            <!-- hide this div after img added -->
                            <div class="photo-box card card-bg card-border max-min-220 upvj" >
                            </div>
                            <!-- show this div after img added -->
                            <div class="updated-img card card-bg card-border max-min-220 upvj" style="display:none">
                                <img src="" id="training-img-preview">
                            </div>
                        </div> 
                    </div>
                    
                </div>
            </div>
        </div>

        <div class="footer section-1-footer"  style="display:none">
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class="theme-color cursur-pointer show-setting" id="hide1">
                                <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="cc gs gt ha gv"><path class="ui-icon__outline cc" d="M13.82,8.07a.735.735,0,0,1,.5.188l1.438,1.3c.2-.008.4,0,.594.007l1.21-1.25a.724.724,0,0,1,.532-.226,3.117,3.117,0,0,1,.867.226c.469.172,1.3.438,1.328,1.032l.094,1.929a5.5,5.5,0,0,1,.414.422c.594-.007,1.187-.023,1.781-.023a.658.658,0,0,1,.352.117,4.122,4.122,0,0,1,1,2.031.735.735,0,0,1-.188.5l-1.3,1.438c.008.2,0,.4-.007.594l1.25,1.21a.724.724,0,0,1,.226.532,3.117,3.117,0,0,1-.226.867c-.172.461-.438,1.3-1.024,1.328l-1.937.094a5.5,5.5,0,0,1-.422.414c.007.594.023,1.187.023,1.781a.611.611,0,0,1-.117.344A4.1,4.1,0,0,1,18.18,23.93a.735.735,0,0,1-.5-.188l-1.438-1.3c-.2.008-.4,0-.594-.007l-1.21,1.25a.724.724,0,0,1-.532.226,3.117,3.117,0,0,1-.867-.226c-.469-.172-1.3-.438-1.328-1.032l-.094-1.929a5.5,5.5,0,0,1-.414-.422c-.594.007-1.187.023-1.781.023a.611.611,0,0,1-.344-.117A4.1,4.1,0,0,1,8.07,18.18a.735.735,0,0,1,.188-.5l1.3-1.438c-.008-.2,0-.4.007-.594l-1.25-1.21a.724.724,0,0,1-.226-.532,3.117,3.117,0,0,1,.226-.867c.172-.461.446-1.3,1.024-1.328l1.937-.094A5.5,5.5,0,0,1,11.7,11.2c-.007-.594-.023-1.187-.023-1.781a.658.658,0,0,1,.117-.352A4.122,4.122,0,0,1,13.82,8.07ZM12.672,9.617l.023,1.8c.008.312-.859,1.164-1.164,1.18l-1.976.1-.422,1.133,1.289,1.258c.2.2.164.562.164.82a1.781,1.781,0,0,1-.148.844L9.117,18.227l.5,1.1c.6-.008,1.211-.023,1.813-.023.312,0,1.156.859,1.172,1.164l.1,1.976,1.133.422,1.258-1.289c.2-.2.562-.164.82-.164a1.7,1.7,0,0,1,.844.148l1.469,1.321,1.1-.5-.023-1.8c-.008-.312.859-1.164,1.164-1.18l1.976-.1.422-1.133-1.289-1.258c-.2-.2-.164-.562-.164-.82a1.781,1.781,0,0,1,.148-.844l1.321-1.469-.5-1.1c-.6.008-1.211.023-1.813.023-.312,0-1.156-.859-1.172-1.164l-.1-1.976-1.133-.422-1.258,1.289c-.2.2-.562.164-.82.164a1.781,1.781,0,0,1-.844-.148L13.773,9.117ZM16.008,13.5A2.5,2.5,0,1,1,13.5,16,2.531,2.531,0,0,1,16.008,13.5ZM16,14.5a1.5,1.5,0,1,0,1.5,1.461A1.513,1.513,0,0,0,16,14.5Z"></path></svg>
                                <span id="due"> ${setting_text}</span>
                            </a>
                        </div>
                        <div class="col-3 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right"
                                id="next1"> Next</button></div>
                    </div>
                </div>
            </div>
        </div>`;

var training_section_view = `<div class="section-2" style="display:none">
            <div class="container pt-4">
                <div id="root" class="">
                    <div class="card-box card-bg card-border training-card-section">
                        <div class="row">
                            <div class="col-9">
                                <h4 id="training-title-content"></h4>
                                <p class="mb0" id="training-description-content"></p>
                            </div>
                            <div class="col-3">
                                <div class="img-thumbnail" style="display:none">
                                    <img src="" id="training-title-image" style="display:none">
                                    <input type="file" placeholder="Upload Cover Image" class="in-t form-control" id="cover-image" accept="image/*" src="images/px-img.png" style="width:100%; height: 180px; display:none"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container pb-100">
                <div class="row">
                    <div class="col-6"><button type="button" class="btn btn-primary btn-sm btn-block" id="add-content"><i class="fa fa-text-width" aria-hidden="true"></i> Add Content</button></div>
                    <div class="col-6"><button type="button" class="btn btn-primary btn-sm btn-block" id="add-questions"><i class="fa fa-question" aria-hidden="true"></i> Add Question</button></div>
                </div>
            </div>
        </div>
        <div class="footer section-2-footer" style="display:none">
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class=" cursur-pointer" id="back">
                                <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs">
                                    <path class="ui-icon__outline gr"
                                        d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                    </path>
                                    <path class="ui-icon__filled"
                                        d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                    </path>
                                </svg> Back
                            </a>
                        </div>
                        <div class="col-3 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right"
                                id="submit"> Submit</button></div>
                    </div>
                </div>
            </div>
        </div>`;

// Question
var questions_section = `<div class="question-section">
        <div class="container question-container">
            <div class="card-box card-border card-bg">
                <div class="form-group">
                    <div class="hover-btn mb-2 h-32">
                        <button type="button" class="close remove-question" data-dismiss="alert">
                            <span aria-hidden="true">
                                <svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg" class="gt gs">
                                    <path
                                        d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                    <path
                                        d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                    <path
                                        d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0" />
                                    <path
                                        d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                </svg>
                            </span>
                            <span class="sr-only">Close</span>
                        </button>
                    </div>
                    <div class="clearfix"></div>
                    <div class="input-group mb-2 ">
                        <div class="input-group-append">
                            <span class="question-number input-group-text input-tpt pl-0 strong"
                                style="cursor: pointer;">1.</span>
                        </div>
                        <input type="text" class="form-control in-t" placeholder="Enter the question"
                            aria-label="Enter the question" aria-describedby="basic-addon2" id="question-title">
                    </div>
                </div>
                <div class="d-flex">
                    <div class="ext-flex"></div>
                    <div class="form-group" id="options">
                        <label><strong>Choices</strong></label>
                        <div class="option-div">
                            <div class="input-group input-group-tpt mb-2 ">
                                <input type="text" class="form-control in-t" placeholder="Option 1"
                                    aria-label="Option 1" aria-describedby="basic-addon2" id="option1">
                                <div class="input-group-append">
                                    <span class="input-group-text remove-option input-tpt" style="cursor: pointer;">
                                        <svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg" class="gt gs">
                                            <path
                                                d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                            <path
                                                d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                            <path
                                                d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0" />
                                            <path
                                                d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div class="input-group mb-2  form-check custom-check-outer">
                                <label class="form-check-label custom-check"><input type="checkbox"
                                        class="form-check-input" id="check1" value="yes"> <span
                                        class="checkmark"></span> Check me if correct</label>
                            </div>

                        </div>
                        <div class="option-div">
                            <div class="input-group input-group-tpt mb-2">
                                <input type="text" class="form-control in-t" placeholder="Option 2"
                                    aria-label="Option 2" aria-describedby="basic-addon2" id="option2">
                                <div class="input-group-append">
                                    <span class="input-group-text remove-option input-tpt" style="cursor: pointer;"><svg
                                            viewBox="-40 0 427 427.00131"
                                            xmlns="http://www.w3.org/2000/svg" class="gt gs">
                                            <path
                                                d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                            <path
                                                d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                            <path
                                                d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0" />
                                            <path
                                                d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                        </svg></span>
                                </div>
                            </div>
                            <div class="input-group mb-2 form-check custom-check-outer">
                                <label class="form-check-label custom-check"><input type="checkbox"
                                        class="form-check-input" value="yes" id="check2"> <span
                                        class="checkmark"></span> Check me if correct</label>
                            </div>

                        </div>
                        <div class="">
                            <button type="button" class="teams-link add-options"> <svg role="presentation"
                                    focusable="false" viewBox="8 8 16 16" class="cc gs gt ha gv">
                                    <path class="ui-icon__outline cc"
                                        d="M23.352 16.117c.098.1.148.217.148.352 0 .136-.05.253-.148.351a.48.48 0 0 1-.352.149h-6v6c0 .136-.05.253-.148.351a.48.48 0 0 1-.352.149.477.477 0 0 1-.352-.149.477.477 0 0 1-.148-.351v-6h-6a.477.477 0 0 1-.352-.149.48.48 0 0 1-.148-.351c0-.135.05-.252.148-.352A.481.481 0 0 1 10 15.97h6v-6c0-.135.049-.253.148-.352a.48.48 0 0 1 .352-.148c.135 0 .252.05.352.148.098.1.148.216.148.352v6h6c.135 0 .252.05.352.148z">
                                    </path>
                                    <path class="ui-icon__filled gr"
                                        d="M23.5 15.969a1.01 1.01 0 0 1-.613.922.971.971 0 0 1-.387.078H17v5.5a1.01 1.01 0 0 1-.613.922.971.971 0 0 1-.387.078.965.965 0 0 1-.387-.079.983.983 0 0 1-.535-.535.97.97 0 0 1-.078-.386v-5.5H9.5a.965.965 0 0 1-.387-.078.983.983 0 0 1-.535-.535.972.972 0 0 1-.078-.387 1.002 1.002 0 0 1 1-1H15v-5.5a1.002 1.002 0 0 1 1.387-.922c.122.052.228.124.32.215a.986.986 0 0 1 .293.707v5.5h5.5a.989.989 0 0 1 .707.293c.09.091.162.198.215.32a.984.984 0 0 1 .078.387z">
                                    </path>
                                </svg> Add more options</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

// Add Question Button
var add_question_button = `<div class="container pb-5 question_button">
                <div class="form-group pb-5">
                    <button type="button" class="btn btn-primary btn-sm" id="add-questions-same-section"> <svg role="presentation"
                            focusable="false" viewBox="8 8 16 16" class="cc gs gt wh gv">
                            <path class="ui-icon__outline cc"
                                d="M23.352 16.117c.098.1.148.217.148.352 0 .136-.05.253-.148.351a.48.48 0 0 1-.352.149h-6v6c0 .136-.05.253-.148.351a.48.48 0 0 1-.352.149.477.477 0 0 1-.352-.149.477.477 0 0 1-.148-.351v-6h-6a.477.477 0 0 1-.352-.149.48.48 0 0 1-.148-.351c0-.135.05-.252.148-.352A.481.481 0 0 1 10 15.97h6v-6c0-.135.049-.253.148-.352a.48.48 0 0 1 .352-.148c.135 0 .252.05.352.148.098.1.148.216.148.352v6h6c.135 0 .252.05.352.148z">
                            </path>
                            <path class="ui-icon__filled gr"
                                d="M23.5 15.969a1.01 1.01 0 0 1-.613.922.971.971 0 0 1-.387.078H17v5.5a1.01 1.01 0 0 1-.613.922.971.971 0 0 1-.387.078.965.965 0 0 1-.387-.079.983.983 0 0 1-.535-.535.97.97 0 0 1-.078-.386v-5.5H9.5a.965.965 0 0 1-.387-.078.983.983 0 0 1-.535-.535.972.972 0 0 1-.078-.387 1.002 1.002 0 0 1 1-1H15v-5.5a1.002 1.002 0 0 1 1.387-.922c.122.052.228.124.32.215a.986.986 0 0 1 .293.707v5.5h5.5a.989.989 0 0 1 .707.293c.09.091.162.198.215.32a.984.984 0 0 1 .078.387z">
                            </path>
                        </svg> Add Questions</button>
                </div>
            </div>`;

// Question Footer
var question_footer = `<div class="footer question-footer" >
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class=" cursur-pointer" id="back-question">
                                <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs">
                                    <path class="ui-icon__outline gr"
                                        d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                    </path>
                                    <path class="ui-icon__filled"
                                        d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                    </path>
                                </svg> Back
                            </a>
                        </div>
                        <div class="col-3 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right"
                                id="question-done"> Done</button></div>
                    </div>
                </div>
            </div>
        </div>`;

// Option
var option_section = `<div style="display: none;" id="option-section">
        <div class="option-div">
            <div class="input-group input-group-tpt mb-2">
                <input type="text" class="form-control in-t" placeholder="Option" aria-label="Recipient's username"
                    aria-describedby="basic-addon2" id="option-1">
                <div class="input-group-append">
                    <span class="input-group-text remove-option input-tpt" style="cursor: pointer;">
                        <svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg" class="gt gs">
                            <path
                                d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                            <path
                                d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                            <path
                                d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0" />
                            <path
                                d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                        </svg>
                    </span>
                </div>
            </div>
            <div class="input-group mb-2  form-check custom-check-outer">
                <label class="custom-check form-check-label">
                    <input type="checkbox" class="form-check-input" value="yes">
                    <span class="checkmark"></span> Check me if correct
                </label>
            </div>
        </div>
    </div>`;

// Text 
var add_text_section = `<div class="text-section" >
            <div class="container pt-4">
                <div id="root" class="">
                    <div class="card-box card-bg card-border">
                        <div class="form-group">
                        <textarea class="in-t form-control" id="training-text" placeholder="Text"></textarea>
                    </div>
                    </div>
                </div>
            </div>
        </div>`;

var add_text_footer = `<div class="footer text-footer" >
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class=" cursur-pointer" id="back-text">
                                <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs">
                                    <path class="ui-icon__outline gr"
                                        d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                    </path>
                                    <path class="ui-icon__filled"
                                        d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                    </path>
                                </svg> Back
                            </a>
                        </div>
                        <div class="col-3 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right"
                                id="text-done"> Done</button></div>
                    </div>
                </div>
            </div>
        </div>`;

// Photo
var add_photo_section = `<div class="text-section" >
            <div class="container pt-4">
                <div id="root" class="">
                    <div class="card-box card-bg card-border">
                        <div class="form-group">
                            <label class="w-100">Upload Photo   <span class="float-right"><a class="upvj change-link" style="display:none">Change?</a></span></label>
                            <div class="relative">
                                <div class="photo-box card card-bg card-border max-min-220 upvj" >
                                    <span>Tap to upload photos</span>
                                </div>
                                
                                <!-- show this div after img added -->
                                <div class="updated-img card card-bg card-border max-min-220" style="display:none">
                                    
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <textarea class="in-t form-control" id="photo-description" placeholder="Description. What is the content about?"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

var add_photo_footer = `<div class="footer text-footer" >
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class=" cursur-pointer" id="back-photo">
                                <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs">
                                    <path class="ui-icon__outline gr"
                                        d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                    </path>
                                    <path class="ui-icon__filled"
                                        d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                    </path>
                                </svg> Back
                            </a>
                        </div>
                        <div class="col-3 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right"
                                id="photo-done"> Done</button></div>
                    </div>
                </div>
            </div>
        </div>`;


// Video
var add_video_section = `<div class="text-section" >
<div class="container pt-4">
    <div id="root" class="">
        <div class="card-box card-bg card-border">
            <div class="form-group">
                <label class="w-100">Upload Video   <span class="float-right"><a class="upvj change-link" style="display:none">Change?</a></span></label>
                <div class="relative">
                    <div class="video-box card card-bg card-border max-min-220 upvj">
                        <span>Tap to upload files</span>
                    </div>
                    <div class="updated-video card card-bg card-border max-min-220 upvj" style="display:none">
                        <div class="embed-responsive embed-responsive-21by9">
                            <video controls class="video video-section-preview">
                            </video>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <textarea class="in-t form-control" id="video-description" placeholder="Description. What is the content about?"></textarea>
            </div>
        </div>
    </div>
</div>
</div>`;

var add_video_footer = `<div class="footer text-footer" >
<div class="footer-padd bt">
    <div class="container ">
        <div class="row">
            <div class="col-9">
                <a class=" cursur-pointer" id="back-video">
                    <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs">
                        <path class="ui-icon__outline gr"
                            d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                        </path>
                        <path class="ui-icon__filled"
                            d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                        </path>
                    </svg> Back
                </a>
            </div>
            <div class="col-3 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right"
                    id="video-done"> Done</button></div>
        </div>
    </div>
</div>
</div>`;


// Document
var add_document_section = `<div class="text-section" >
<div class="container pt-4">
    <div id="root" class="">
        <div class="card-box card-bg card-border">
            <div class="form-group">
                <div class="relative">
                    <!-- hide this div afte img added -->
                    <div class="doc-box card card-bg card-border max-min-220 upvj">
                        <span>Tap to upload files</span>
                    </div>
                    <!-- show this div afte img added -->
                    <div class="card-bg card-border p14 doc-name">
                    </div>


                </div>
                <!-- <img src="" id="document-image-preview"> -->
            </div>
            <div class="form-group">
                <textarea class="in-t form-control" id="document-description" placeholder="Description. What is the content about?"></textarea>
            </div>
        </div>
    </div>
</div>
</div>`;

var add_document_footer = `<div class="footer text-footer" >
<div class="footer-padd bt">
    <div class="container ">
        <div class="row">
            <div class="col-9">
                <a class=" cursur-pointer" id="back-photo">
                    <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs">
                        <path class="ui-icon__outline gr"
                            d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                        </path>
                        <path class="ui-icon__filled"
                            d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                        </path>
                    </svg> Back
                </a>
            </div>
            <div class="col-3 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right"
                    id="document-done"> Done</button></div>
        </div>
    </div>
</div>
</div>`;


// Setting 
var setting_section1 = `<div class="" style="display: none;" id="setting">
        <div class="container pt-4 setting-section">
            <div class="row">
                <div class="col-sm-12">
                    <label><strong>Due by</strong></label>
                </div>
                <div class="clearfix"></div>
                <div class="col-1"></div>
                <div class="col-5">
                    <div class="input-group input-group-tpt mb-2">
                        <input type="date" name="expiry_date" class="form-control in-t" placeholder="Date"
                            aria-label="Expiry Date" aria-describedby="basic-addon2" id="expiry-date">
                    </div>
                </div>
                <div class="col-5">
                    <div class="input-group input-group-tpt mb-2">
                        <input type="time" name="expiry_time" class="form-control in-t" placeholder="Time"
                            aria-label="Time" aria-describedby="basic-addon2" id="expiry-time" value="23:59">
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="col-12">
                    <label><strong>Results visible to</strong></label>
                </div>
                <div class="clearfix"></div>
                <div class="col-1"></div>
                <div class="col-11">
                    <div class="custom-radio-outer">
                        <label class="custom-radio">
                            <input type="radio" name="visible_to" class="visible-to" value="Everyone" checked>
                            <span class="radio-block"></span> Everyone
                        </label>
                    </div>
                    <div class="custom-radio-outer">
                        <label class="custom-radio">
                            <input type="radio" name="visible_to" class="visible-to" value="Only me"><span
                                class="radio-block"></span> Only Me
                        </label>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="col-12">
                    <label><strong>Show correct answer after each question</strong></label>
                </div>
                <div class="clearfix"></div>
                <div class="col-1"></div>
                <div class="col-11">
                    <div class="row">
                        <div class="col-12">
                            <div class="custom-check-outer">
                                <label class="custom-check form-check-label">
                                    <input type="checkbox" name="show_correct_answer" id="show-correct-answer"
                                        value="Yes" checked/>
                                    <span class="checkmark"></span>
                                    Answer cannot be changed if this option is selected
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="footer-padd bt">
                    <div class="container ">
                        <div class="row">
                            <div class="col-9">
                                <a class=" cursur-pointer" id="back-setting">
                                    <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs">
                                        <path class="ui-icon__outline gr"
                                            d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                        </path>
                                        <path class="ui-icon__filled"
                                            d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                        </path>
                                    </svg> Back
                                </a>
                            </div>
                            <div class="col-3">
                                <button type="button" class="btn btn-tpt">&nbsp;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

// Setting Section
let setting_section = `<div style="display:none" id="setting">
        <div class="container pt-4 setting-section">
            <div class="row">
                <div class="col-sm-12">
                    <label><strong class="due-by-key">${dueByKey}</strong></label>
                </div>
                <div class="clearfix"></div>
                <div class="col-1"></div>
                <div class="col-5">
                    <div class="input-group date form_date" data-date="1979-09-16T05:25:07Z" data-date-format="M dd, yyyy" data-link-field="dtp_input1">
                        <input class="form-control in-t" size="16" name="expiry_date" type="text" value="" readonly>
                    </div>
                </div>
                <div class="col-5">
                    <div class="input-group date form_time" data-date="" data-date-format="hh:ii" data-link-field="dtp_input3" data-link-format="hh:ii">
                        <input class="form-control in-t" name="expiry_time" size="16" type="text" value="" readonly>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="col-12">
                    <label><strong class="result-visible-key">${resultVisibleToKey}</strong></label>
                </div>
                <div class="clearfix"></div>
                <div class="col-1"></div>
                <div class="col-11">
                    <div class="custom-radio-outer">
                        <label class="custom-radio">
                            <input type="radio" name="visible_to" class="visible-to" value="Everyone" checked>
                            <span class="radio-block"></span> <span class="everyone-key">${everyoneKey}</span>
                        </label>
                    </div>
                    <div class="custom-radio-outer">
                        <label class="custom-radio">
                            <input type="radio" name="visible_to" class="visible-to" value="Only me"><span
                                class="radio-block"></span> <span class="onlyme-key">${onlyMeKey}</span>
                        </label>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="col-12">
                    <div class="input-group mb-2 form-check custom-check-outer">
                        <label class="custom-check form-check-label">
                            <input type="checkbox" name="show_correct_answer" id="show-correct-answer" value="Yes" checked/>
                            <span class="checkmark"></span>
                        </label>
                        <label><strong class="show-correct-key">${showCorrectAnswerKey}</strong></label>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="col-1"></div>
                <div class="col-11">
                    <label>
                        <span class="answer-cannot-change-key">${answerCannotChangeKey}</span>
                    </label>
                </div>
            </div>
            <div class="footer">
                <div class="footer-padd bt">
                    <div class="container ">
                        <div class="row">
                            <div class="col-9">
                                <a class=" cursur-pointer" id="back">
                                    <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="back-btn">
                                        <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                        </path>
                                        <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                        </path>
                                    </svg> <span class="back-key" id="back-setting">${backKey}</span>
                                </a>
                            </div>
                            <div class="col-3">
                                <button class="btn btn-tpt">&nbsp;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;


//  modal
var modal_section = `<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title app-black-color" id="exampleModalLongTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body app-black-color">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Back</button>
                    <button type="button" class="btn btn-primary btn-sm" id="save-changes">Save changes</button>
                </div>
            </div>
        </div>
    </div>`;


var toggle_section = `<div class="slideup-content">
    <div class="row">
        <div class="col-3">
            <div id="add-text">
                <i data-icon-name="InsertTextBox" aria-hidden="true" class="ms-Icon root-43"></i>

                <p>Text</p>
            </div>
        </div>
        <div class="col-3">
            <div id="add-photo">
                <i data-icon-name="PictureFill" aria-hidden="true" class="ms-Icon root-43"></i>
                <p>Photo</p>
            </div>
        </div>
        <div class="col-3">
            <div id="add-document">
                <i data-icon-name="TextDocument" aria-hidden="true" class="ms-Icon root-43"></i>
                <p>Document</p>
            </div>
        </div>
        <div class="col-3">
            <div id="add-video">
                <i data-icon-name="Video" aria-hidden="true" class="ms-Icon root-43"></i>
                <p>Video</p>
            </div>
        </div>
    </div>
</div>`;

/***********************************  HTML Section Ends***************************/
/***********************************  HTML Section Ends***************************/
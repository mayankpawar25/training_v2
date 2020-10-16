import { Localizer, ActionHelper } from '../common/ActionSdkHelper';

let $root = "";
let row = {};
let actionInstance = null;
let summary_answer_resp = [];
let memberIds = [];
let myUserId = [];
let contextActionId;
let request = '';
let actionDataRows = null;
let actionDataRowsLength = 0;

let questionKey = '';
let questionsKey = '';
let startKey = '';
let noteKey = '';
let correctKey = '';
let incorrectKey = '';
let correctAnswerIsKey = '';
let submitKey = '';
let nextKey = '';
let backKey = '';
let pagination = 0;
let choiceAnyChoiceKey = '';
let continueKey = '';
let answerResponseKey = '';
let yourAnswerKey = '';
let correctAnswerKey = '';
let yourAnswerIsKey = '';
let quizSummaryKey = '';
let quizExpiredKey = '';
let rightAnswerIsKey = '';

/* Async method for fetching localization strings */
/**
 * Method to get Local string
 */
async function getStringKeys() {
    Localizer.getString('question').then(function(result) {
        questionKey = result;
        $('.question-key').text(questionKey);
    });

    Localizer.getString('questions').then(function(result) {
        questionsKey = result;
        $('.question-key').text(questionsKey);
    });

    Localizer.getString('start').then(function(result) {
        startKey = result;
        $('#start').text(startKey);
    });

    Localizer.getString('note').then(function(result) {
        noteKey = result;
        $('.note-key').text(noteKey);
    });

    Localizer.getString('choose_any_choice').then(function(result) {
        choiceAnyChoiceKey = result;
    });

    Localizer.getString('continue').then(function(result) {
        continueKey = result;
    });

    Localizer.getString('answer_response').then(function(result) {
        answerResponseKey = result;
    });

    Localizer.getString('correct').then(function(result) {
        correctKey = result;
    });

    Localizer.getString('your_answer').then(function(result) {
        yourAnswerKey = result;
    });

    Localizer.getString('incorrect').then(function(result) {
        incorrectKey = result;
    });

    Localizer.getString('correct_answer').then(function(result) {
        correctAnswerKey = result;
    });

    Localizer.getString('your_answer_is').then(function(result) {
        yourAnswerIsKey = result;
    });

    Localizer.getString('right_answer_is').then(function(result) {
        rightAnswerIsKey = result;
    });

    Localizer.getString('submit').then(function(result) {
        submitKey = result;
        $('.submit-key').text(submitKey);
    });

    Localizer.getString('quiz_summary').then(function(result) {
        quizSummaryKey = result;
    });

    Localizer.getString('next').then(function(result) {
        nextKey = result;
        $('.next-key').text(nextKey);
    });

    Localizer.getString('back').then(function(result) {
        backKey = result;
        $('.back-key').text(backKey);
    });

    Localizer.getString('quiz_expired').then(function(result) {
        quizExpiredKey = result;
        $('#quiz-expired-key').text(backKey);
    });

    Localizer.getString('correct_answer_is').then(function(result) {
        correctAnswerIsKey = result;
    });

}

/*
 * Method to get theme and load page content 
 * @param request object
 */
async function getTheme(request) {
    let response = await ActionHelper.executeApi(request);
    let context = response.context;
    $("form.section-1").show();
    let theme = context.theme;
    $("link#theme").attr("href", "css/style-" + theme + ".css");

    $('div.section-1').append(`<div class="row"><div class="col-12"><div id="root"></div></div></div>`);
    $root = $("#root");
    setTimeout(() => {
        $('div.section-1').show();
        $('div.footer').show();
    }, 1000);
    ActionHelper.hideLoader();
    OnPageLoad();
}

/*
 * Method to get responder ids who responded the app
 * @param actionId string identifier
 */
async function getResponderIds(actionId) {
    ActionHelper
        .executeApi(ActionHelper.requestDataRows(actionId))
        .then(function(batchResponse) {
            actionDataRows = batchResponse.dataRows;
            actionDataRowsLength = actionDataRows == null ? 0 : actionDataRows.length;

            if (actionDataRowsLength > 0) {
                for (let i = 0; i < actionDataRowsLength; i++) {
                    memberIds.push(actionDataRows[i].creatorId);
                }
            }
        })
        .catch(function(error) {
            console.error("Console log: Error: " + JSON.stringify(error));
        });
}

// *********************************************** HTML ELEMENT***********************************************
/*
 * Event when document is ready
 */
$(document).ready(function() {
    request = ActionHelper.getContextRequest();
    getStringKeys();
    getTheme(request);
});

/*
 * Method to create body when page load
 */
function OnPageLoad() {
    ActionHelper.executeApi(request).then(function(response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            myUserId = response.context.userId;
            contextActionId = response.context.actionId
            getResponderIds(contextActionId);
            getActionInstance(response.context.actionId);
        })
        .catch(function(error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        });
}

/*
 * Method to create body of the app
 * @param actionId string identifier
 */
function getActionInstance(actionId) {
    ActionHelper.executeApi(ActionHelper.getActionRequest(actionId))
        .then(function(response) {
            console.info("Response: " + JSON.stringify(response));
            actionInstance = response.action;
            createBody();
        })
        /* .catch(function(error) {
            console.log("Error: " + JSON.stringify(error));
        }) */
    ;
}

/*
 * Method to create body
 */
function createBody() {
    /* Check if already responded */
    if ($.inArray(myUserId, memberIds) > -1) {
        Localizer.getString('alreadyTired').then(function(result) {
            $('div.section-1').append(`<div><b> ${result} </b></div>`);
        });
        return;
    }

    /*  Check Expiry date time  */
    let current_time = new Date().getTime();
    if (actionInstance.expiryTime <= current_time) {
        let $card = $('<div class="card"></div>');
        let $spDiv = $('<div class="col-sm-12"></div>');
        let $sDiv = $('<div class="form-group">Quiz Expired...</div>');
        $card.append($spDiv);
        $spDiv.append($sDiv);
        $root.append($card);
    } else {

        $('div.section-1').show();
        $('div.section-1').append(head_section1);
        $('#section1-training-title').html(actionInstance.displayName);
        $('#section1-training-description').html(actionInstance.customProperties[0].value);

        /* Check if image upload for training */
        let req = ActionHelper.getAttachmentInfo(actionInstance.customProperties[4].value);

        ActionHelper.executeApi(req)
            .then(function(response) {
                console.info("Attachment - Response: " + JSON.stringify(response));
                $('#section1-training-description').after(`<img src="${response.attachmentInfo.downloadUrl}" class="img-responsive w-100"/>`);
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error: " + JSON.stringify(error));
            });


        /* Create Text and Question summary */
        actionInstance.dataTables.forEach((dataTable) => {
            dataTable.dataColumns.forEach((data, ind) => {
                if (data.valueType == 'LargeText') {
                    /* Call Text Section 1 */
                    let counter = $('div.card-box').length;
                    let text_title = data.displayName.length > 100 ? data.displayName.substr(0, data.displayName.lastIndexOf(' ', 97)) + '...' : data.displayName;

                    if (data.name.indexOf("photo") >= 0) {
                        $('div.section-1').append(text_section3);
                        $('div.card-box:last').attr('id', 'contain-' + counter);
                        $('div.card-box#contain-' + counter).find('span.counter').text(counter);
                        $('div.card-box#contain-' + counter).find('.text-description').text(text_title);
                        Localizer.getString('photo').then(function(result) {
                            $('div.card-box#contain-' + counter).find('span.training-type').text(result);
                            $('div.card-box#contain-' + counter).find("img.image-sec").attr('id', data.name);
                        });
                        let dname = isJson(data.options[0].displayName) ? JSON.parse(data.options[0].displayName) : data.options[0].displayName;
                        let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                        if (attachment != undefined) {
                            let attachment_img = '';
                            $.each(attachment, function(ind, att) {
                                attachment_img = att;
                                return false;
                            });
                            let req = ActionHelper.getAttachmentInfo(attachment_img);
                            let filesAmount = Object.keys(attachment).length;
                            ActionHelper.executeApi(req).then(function(response) {
                                    console.info("Attachment - Response photo:  " + JSON.stringify(response));
                                    $('div.card-box#contain-' + counter).find("img#" + data.name).attr('src', response.attachmentInfo.downloadUrl);
                                    if (filesAmount > 1)
                                        $('div.card-box#contain-' + counter).find("img#" + data.name).after(`<span class="file-counter">+${filesAmount-1}</span>`);
                                })
                                .catch(function(error) {
                                    console.error("AttachmentAction - Error: " + JSON.stringify(error));
                                });
                        }
                    } else if (data.name.indexOf("document") >= 0) {
                        $('div.section-1').append(text_section3);
                        $('div.card-box:last').attr('id', 'contain-' + counter);
                        $('div.card-box#contain-' + counter).find('span.counter').text(counter);
                        $('div.card-box#contain-' + counter).find('.text-description').text(text_title);
                        $('div.card-box#contain-' + counter).find("img.image-sec").attr('id', data.name);
                        Localizer.getString('document').then(function(result) {
                            $('div.card-box#contain-' + counter).find('span.training-type').text(result);
                            $("img#" + data.name).attr('src', 'images/doc.png');
                        });
                    } else if (data.name.indexOf("video") >= 0) {
                        $('div.section-1').append(text_section3);
                        $('div.card-box:last').attr('id', 'contain-' + counter);
                        $('div.card-box#contain-' + counter).find('span.counter').text(counter);
                        $('div.card-box#contain-' + counter).find('.text-description').text(text_title);
                        Localizer.getString('video').then(function(result) {
                            $('div.card-box#contain-' + counter).find('span.training-type').text(result);
                            $('div.card-box#contain-' + counter).find("img.image-sec").remove();
                            $('div.card-box#contain-' + counter).attr("id", data.name);
                        });

                        let dname = isJson(data.options[0].displayName) ? JSON.parse(data.options[0].displayName) : data.options[0].displayName;
                        let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                        if (attachment != undefined) {
                            let req = ActionHelper.getAttachmentInfo(attachment[0]);
                            ActionHelper.executeApi(req)
                                .then(function(response) {
                                    console.info("Attachment - Response: " + JSON.stringify(response));
                                    $('div.card-box#contain-' + counter).find('#' + data.name).find(".img-thumbnail").append('<div class="embed-responsive embed-responsive-4by3"><video controls="" class="video" id="' + data.name + '" src="' + response.attachmentInfo.downloadUrl + '"></video></div>');
                                })
                                .catch(function(error) {
                                    console.error("AttachmentAction - Error: " + JSON.stringify(error));
                                });
                        }
                    } else {
                        /* text */
                        $('div.section-1').append(text_section1);
                        $('div.card-box:last').attr('id', 'contain-' + counter);
                        $('div.card-box#contain-' + counter).find('span.counter').text(counter);
                        Localizer.getString('text').then(function(result) {
                            $('div.card-box#contain-' + counter).find('span.training-type').text(result);
                            $('div.card-box#contain-' + counter).find('.text-description').text(text_title);
                        });
                    }

                } else if (data.valueType == 'SingleOption' || data.valueType == 'MultiOption') {
                    /* Call Question Section 1 */
                    let counter = $('div.card-box').length;
                    let text_title = data.displayName.length > 100 ? data.displayName.substr(0, data.displayName.lastIndexOf(' ', 97)) + '...' : data.displayName;
                    $('div.section-1').append(question_section1);
                    $('div.card-box:last').attr('id', 'contain-' + counter);
                    $('div.card-box#contain-' + counter).find('span.counter').text(counter);
                    Localizer.getString('question_with', numbertowords(Object.keys(data.options).length)).then(function(result) {
                        $('div.card-box#contain-' + counter).find('.question-title').text(result);
                        $('div.card-box#contain-' + counter).find('.question-title-main').text(text_title);
                    });
                }
            });
        });

        $('div.section-1').append(`<div class="container pb-100"></div>`);
        $('div.section-1').after(footer_section1);
    }


}

/*
 * Event to submit form
 */
$(document).on('click', '.submit-form', function() {
    submitForm();
})


/*
 * Method to create question view
 * @param actionId string identifier
 */
function createQuestionView(index_num) {
    let count = 1;
    actionInstance.dataTables.forEach((dataTable) => {
        dataTable.dataColumns.forEach((question, ind) => {

            if (ind == index_num) {
                let count = ind + 1;
                let $card = $('<div class="card-box card-blank"></div>');

                let $questionHeading = `<div class="form-group">
                    <div class="hover-btn ">
                        <label><strong><span class="counter">${count}</span>. <span class="training-type">Question</span></strong> </label>
                    </div>
                    <div class="clearfix"></div>
                    <hr>
                </div>
                <label><strong>${question.displayName}</strong></label>`;

                $card.append($questionHeading);
                let choice_occurance = 0;
                /* Check multichoice or single choice options  */
                if (question.valueType == "SingleOption") {
                    choice_occurance = 1;
                } else {
                    choice_occurance = 2;
                }

                //add radio button
                if (choice_occurance > 1) {
                    question.options.forEach((option) => {
                        let $radioOption = getCheckboxButton(
                            option.displayName,
                            question.name,
                            option.name
                        );
                        $card.append($radioOption);
                    });
                } else {
                    //add checkbox button
                    question.options.forEach((option) => {
                        let $radioOption = getRadioButton(
                            option.displayName,
                            question.name,
                            option.name
                        );
                        $card.append($radioOption);
                    });
                }
                $('div.section-2 > .container:first').append($card);
            }

        });

        count++;
    });
    if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").parent('label').attr('disabled') !== "disabled") {
        $('#next').text('Check').attr('id', 'check');
    }
}

/*
 * Method to create radio button
 * @param text string
 * @param name string
 * @param id string identifier
 */
function getRadioButton(text, name, id) {
    let $div_data = $(`<div class="form-group radio-section custom-radio-outer" id="${id}" columnId="${name}" ><label class="custom-radio"><input type="radio" name="${name}" id="${id}"> <span class="radio-block"></span> ${text}</label></div>`)
    return $div_data;
}

/*
 * Method to create checkbox button
 * @param text string
 * @param name string
 * @param id string identifier
 */
function getCheckboxButton(text, name, id) {
    let div_data = $(`<div class="form-group radio-section custom-check-outer" id="${id}" columnId="${name}" ><label class="custom-check form-check-label"><input type="checkbox" class="form-check-input" name="${name}" id="${id}"><span class="checkmark"></span> ${text}</label></div>`)
    return div_data;
}

/*
 * Method to get number to word
 * @param num number
 */
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

/*
 * Method to show Result view if already attempted the quiz
 */
function loadSummaryView() {
    $('div.section-2').hide();
    $('div.section-2-footer').hide();

    if ($('.section-3').length <= 0) {
        $('div.section-2').after(`<div class="section-3"><div class="container pt-4"><label><strong>Training Summary</strong></label></div><div class="container pb-100"></div></div>`);

        $('div.section-3 .container:first').append(head_section1);
        $('div.section-3 .container:first').after(footer_section3);
        $('div.section-3 #section1-training-title').html(actionInstance.displayName);
        $('div.section-3 #section1-training-description').html(actionInstance.customProperties[0].value);

        /* Create Text and Question summary */
        actionInstance.dataTables.forEach((dataTable) => {
            dataTable.dataColumns.forEach((data, ind) => {
                if (data.valueType == 'LargeText') {
                    /* Call Text Section 1 */
                    let counter = $('.section-3 div.card-box').length;
                    let text_title = data.displayName.length > 100 ? data.displayName.substr(0, data.displayName.lastIndexOf(' ', 97)) + '...' : data.displayName;
                    $('div.section-3 .container:first').append(text_section1);
                    $('div.card-box:last').find('span.counter').text(counter);
                    $('div.card-box:last').find('.text-description').text(text_title);

                    if (data.name.indexOf("photo") >= 0) {
                        Localizer.getString('photo').then(function(result) {
                            $('div.card-box:last').find('.training-type').text(result);
                        });
                    } else if (data.name.indexOf("video") >= 0) {
                        Localizer.getString('video').then(function(result) {
                            $('div.card-box:last').find('.training-type').text(result);
                        });
                    } else if (data.name.indexOf("document") >= 0) {
                        Localizer.getString('document').then(function(result) {
                            $('div.card-box:last').find('.training-type').text(result);
                        });
                    }
                } else if (data.valueType == 'SingleOption' || data.valueType == 'MultiOption') {
                    /* Call Question Section 1 */
                    let counter = $('.section-3 div.card-box').length;
                    let text_title = data.displayName.length > 100 ? data.displayName.substr(0, data.displayName.lastIndexOf(' ', 97)) + '...' : data.displayName;
                    $('div.section-3 .container:first').append(question_section1);
                    $('div.card-box:last').find('span.counter').text(counter);
                    Localizer.getString('question_with', numbertowords(Object.keys(data.options).length)).then(function(result) {
                        $('div.card-box:last').find('.question-title').text(result);
                        $('div.card-box:last').find('.question-title-main').text(text_title);
                        if (actionInstance.customProperties[3].value == 'Yes') {
                            $('div.card-box:last').find('.result').html(summary_answer_resp[ind] == true ? `<span class="float-right result text-success"><i class="fa fa-check" aria-hidden="true"></i> ${correctKey}</span>` : `<span class="float-right result text-danger"><i class="fa fa-remove" aria-hidden="true"></i> ${incorrectKey}</span>`);
                        }
                    });
                }
            });
        });
    }

}


// *********************************************** HTML ELEMENT END***********************************************

// *********************************************** SUBMIT ACTION***********************************************
/*
 * Method to submit form
 */
function submitForm() {
    ActionHelper
        .executeApi(ActionHelper.getContextRequest())
        .then(function(response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            addDataRows(response.context.actionId);
        })
        .catch(function(error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        });
}

/*
 * Method to generate guid
 */
function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/*
 * Method to get data row
 * @param actioId string identifier
 */
function getDataRow(actionId) {
    let data = {
        id: generateGUID(),
        actionId: actionId,
        dataTableId: "TestDataSet",
        columnValues: row,
    };
    return data;
}

/*
 * Method to add data row 
 * @param actionId string identifier
 */
function addDataRows(actionId) {
    let addDataRowRequest = addDataRow(getDataRow(actionId))
    let closeViewRequest = ActionHelper.closeView();
    let batchRequest = ActionHelper.batchRequest([addDataRowRequest, closeViewRequest]);
    ActionHelper.executeBatchApi(batchRequest)
        .then(function(batchResponse) {
            console.info("BatchResponse: " + JSON.stringify(batchResponse));
        })
        .catch(function(error) {
            console.error("Error: " + JSON.stringify(error));
        });
}

/*
 * Method to create training section with pagination
 * @param index_num number identifier
 */
function createTrainingSection(index_num) {
    /* Create Text and Question summary */
    actionInstance.dataTables.forEach((dataTable, index) => {
        if (index == 0) {
            let y = Object.keys(dataTable.dataColumns).length;
            $('#y').text(y);

            dataTable.dataColumns.forEach((data, ind) => {
                if (ind == index_num) {
                    let x = ind + 1;
                    $('#x').text(x);

                    if (data.valueType == 'LargeText') {
                        /* Call Text Section 1 */
                        $('div.section-2 > .container:first').append(text_section2);
                        let counter = $('div.section-2 .container > div.card-box').length;
                        let text_title = data.displayName;
                        $('div.section-2 > .container:first > div.card-box:last').find('span.counter').text(counter);
                        $('div.section-2 > .container:first > div.card-box:last').find('.text-description').text(text_title);

                        if (data.name.indexOf("photo") >= 0) {
                            Localizer.getString('photo').then(function(result) {
                                $('div.section-2 > .container:first > div.card-box:last').find('span.section-type-title').text(result);
                            })

                            let dname = isJson(data.options[0].displayName) ? JSON.parse(data.options[0].displayName) : data.options[0].displayName;
                            let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                            let $carousel = $('<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel"></div>');
                            let $ol_section = $('<ol class="carousel-indicators"></ol>');
                            let $carousel_inner = $('<div class="carousel-inner"></div>');

                            if (attachment != undefined) {
                                let filesAmount = Object.keys(attachment).length;

                                $carousel.append($ol_section);
                                $carousel.append($carousel_inner);

                                let count = 0;
                                $.each(attachment, function(i, att) {
                                    let req = ActionHelper.getAttachmentInfo(att);

                                    ActionHelper.executeApi(req)
                                        .then(function(response) {

                                            let $img_div = $(`<div class="carousel-item ${count == 0 ? 'active' : ''}">
                                                            <img class="d-block w-100" src="${response.attachmentInfo.downloadUrl}" alt="${count+1} slide">
                                                        </div>`);
                                            $carousel_inner.append($img_div);

                                            if (count == (filesAmount - 1)) {
                                                $carousel.append(`<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span class="sr-only">Previous</span>
                                                </a>
                                                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span class="sr-only">Next</span>
                                                </a>`);

                                                $('div.section-2 .container:first div.card-box:visible').find('.text-description').before($carousel);
                                                $('.carousel').carousel();
                                                $('.carousel').after('<hr>');
                                            }
                                            count++;
                                        })
                                        .catch(function(error) {
                                            console.error("AttachmentAction - Error: " + JSON.stringify(error));
                                        });
                                })

                            }
                        } else if (data.name.indexOf("document") >= 0) {
                            Localizer.getString('document').then(function(result) {
                                $('div.section-2 > .container:first > div.card-box:last').find('span.section-type-title').text(result);
                            });

                            let dname = isJson(data.options[0].displayName) ? JSON.parse(data.options[0].displayName) : data.options[0].displayName;
                            let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                            let req = ActionHelper.getAttachmentInfo(attachment[0]);

                            ActionHelper.executeApi(req)
                                .then(function(response) {
                                    console.info("Attachment - Response: " + JSON.stringify(response));
                                    $('div.section-2 > .container:first > div.card-box:last').find(".text-description").after('<hr><a href="' + response.attachmentInfo.downloadUrl + '" class="teams-link" download>View Document</a>');
                                })
                                .catch(function(error) {
                                    console.error("AttachmentAction - Error: " + JSON.stringify(error));
                                });

                        } else if (data.name.indexOf("video") >= 0) {
                            $('div.section-1').append(text_section3);
                            $('div.section-2 > .container:first > div.card-box:last').find('span.counter').text(counter);
                            $('div.section-2 > .container:first > div.card-box:last').find('.text-description').text(text_title);
                            Localizer.getString('video').then(function(result) {
                                $('div.section-2 > .container:first > div.card-box:last').find('span.section-type-title').text(result);
                                $('div.section-2 > .container:first > div.card-box:last').find("img.image-sec").remove();
                                $('div.section-2 > .container:first > div.card-box:last').attr("id", data.name);
                            });

                            let dname = isJson(data.options[0].displayName) ? JSON.parse(data.options[0].displayName) : data.options[0].displayName;
                            let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                            let req = ActionHelper.getAttachmentInfo(attachment[0]);
                            ActionHelper.executeApi(req)
                                .then(function(response) {
                                    console.info("Attachment - Response: " + JSON.stringify(response));
                                    $('div.section-2 > .container:first > div.card-box:last').find(".text-description").before('<div class="embed-responsive embed-responsive-4by3"><video controls="" class="video" id="' + data.name + '" src="' + response.attachmentInfo.downloadUrl + '"></video></div><hr>');
                                })
                                .catch(function(error) {
                                    console.error("AttachmentAction - Error: " + JSON.stringify(error));
                                });

                        } else {
                            /* text */
                            $('div.section-1').append(text_section1);
                            $('div.card-box:last').find('span.counter').text(counter);
                            $('div.card-box:last').find('.text-description').text(text_title);

                        }

                    } else if (data.valueType == 'SingleOption' || data.valueType == 'MultiOption') {
                        createQuestionView(index_num);
                        let counter = $('div.section-2 .container > div.card-box').length;
                        $('div.section-2 > .container:first > div.card-box:last').find('span.counter').text(counter);
                    }
                }
            });
        }
    });
}

/*
 * Method to validate string is json
 * @param str string
 */
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// *********************************************** SUBMIT ACTION END***********************************************
// *********************************************** OTHER ACTION STARTS***********************************************

/*
 * Event when click on start button on summary view of page
 */
$(document).on('click', '#start', function() {
    $('div.section-1').hide();
    $('div.section-1-footer').hide();
    $('div.section-1').after(`<div class="section-2"><div class="container pt-4"></div></div>`);

    /* Show first section */
    $('div.section-2').after(footer_section2);
    $('div.section-2').append(`<div class="container pb-100"></div>`);

    createTrainingSection(pagination);
    $('#back').prop('disabled', true);
});

/*
 * Event to click on check button for getting correct or incorrect answer
 */
$(document).on('click', '#check', function() {
    /* Question Validations */
    let data = [];
    let answerKeys = isJson(actionInstance.customProperties[5].value) ? JSON.parse(actionInstance.customProperties[5].value) : actionInstance.customProperties[5].value;

    let correct_ans_arr = [];
    let selected_answer = [];
    let check_counter = 0;
    let correct_answer = false;
    let attr_name = '';

    let is_checked = false;

    $('div.card-box:visible').find("input[type='checkbox']:checked").each(function(ind, ele) {
        if ($(ele).is(':checked')) {
            check_counter++;
            selected_answer.push($.trim($(ele).attr('id')));
            attr_name = $(ele).attr('name');
            data.push($(this).attr("id"));

            is_checked = true;
        }
    });

    if (!row[(pagination + 1)]) {

        row[(pagination + 1)] = [];
    }
    row[(pagination + 1)] = JSON.stringify(data);

    $('div.card-box:visible').find("input[type='radio']:checked").each(function(ind, ele) {
        if ($(ele).is(':checked')) {
            check_counter++;
            selected_answer.push($.trim($(ele).attr('id')));
            attr_name = $(ele).attr('name');

            if (!row[(pagination + 1)]) row[(pagination + 1)] = [];
            row[(pagination + 1)] = $(this).attr("id");

            is_checked = true;
        }
    });

    if (check_counter <= 0) {
        $('#next').prop('disabled', true);
    } else {
        $('#next').prop('disabled', false);
    }

    if ($('.error-msg').length > 0)
        $('.error-msg').remove();

    /* Validate if show answer is Yes */
    if (is_checked == true) {
        is_checked = false;
        let ans_res = [];
        $.each(selected_answer, function(i, selected_subarray) {
            if ($.inArray(selected_subarray, answerKeys[(attr_name - 1)]) !== -1) {
                ans_res.push("true");
            } else {
                ans_res.push("false");
            }
        });

        if ((answerKeys[(attr_name - 1)].length == ans_res.length) && ($.inArray("false", ans_res) == -1)) {
            correct_answer = true
        } else {
            correct_answer = false;
        }

        $('div.section-2').find('div.card-box').each(function(inde, ele) {
            if ($(ele).is(':visible')) {
                summary_answer_resp[inde] = correct_answer;
                return false;
            }
        });

        $.each(answerKeys[(attr_name - 1)], function(ii, subarr) {
            correct_ans_arr.push($.trim($('#' + subarr).text()));
        });

        let correct_value = correct_ans_arr.join();

        if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").parent('label').attr('disabled') !== "disabled") {
            if (correct_answer == true) {
                $('div.card-box:last').find('.result').remove();
                $('div.card-box:last').append(`
                        <div class="result">
                        <hr>
                            <div class="form-group">
                                <div class="hover-btn ">
                                    <label><strong><span class="question-title">Result</span></strong> </label>
                                    <span class="float-right result"><span class="float-right result text-success"><i class="fa fa-check" aria-hidden="true"></i> ${correctKey}</span></span>
                                    <button type="button" class="close remove-question" data-dismiss="alert">
                                        <span aria-hidden="true">
                                            
                                        </span>
                                        <span class="sr-only">Close</span>
                                    </button>
                                </div>
                                <div class="clearfix"></div>
                                <hr>
                            </div>
                            <label><strong>${correctAnswerIsKey}: </strong> <span class="question-title-main">${correct_value}</span></label>
                        </div>`);

                $('#check').text('Next').attr('id', 'next');

            } else {
                $('div.card-box:last').find('.result').remove();
                $('div.card-box:last').append(`
                        <div class="result">
                        <hr>
                            <div class="form-group">
                                <div class="hover-btn ">
                                    <label><strong><span class="question-title">Result</span></strong> </label><span class="float-right result"><span class="float-right result text-danger"><i class="fa fa-remove" aria-hidden="true"></i> ${incorrectKey}</span></span>
                                    <button type="button" class="close remove-question" data-dismiss="alert">
                                        <span aria-hidden="true">
                                            
                                        </span>
                                        <span class="sr-only">Close</span>
                                    </button>
                                </div>
                                <div class="clearfix"></div>
                                <hr>
                            </div>
                            <label><strong>${correctAnswerIsKey}: </strong> <span class="question-title-main">${correct_value}</span></label>
                        </div>`);

                $('#check').text('Next').attr('id', 'next');
            }

            $('div.section-2').find('div.card-box:visible').find("input").each(function(ind, ele) {
                $(ele).parent('label').attr('disabled', true);
                if ($(ele).parents('div.custom-radio-outer').length > 0)
                    $(ele).parents('div.custom-radio-outer').addClass('disabled');
                else
                    $(ele).parents('div.custom-check-outer').addClass('disabled');
            });
        }

    } else {
        Localizer.getString('note_please_choose_choice').then(function(result) {
            $('div.section-2').find('div.card-box:visible').prepend(`<div class="alert alert-danger error-msg">${result}</div>`);
        });
    }

});

/*
 * Event to click on next button to load next page or content
 */
$(document).on('click', '#next', function() {
    let data = [];
    let limit = $('#y').text();

    if ($('.error-msg').length > 0)
        $('.error-msg').remove();


    /* Validate */
    if ($('div.card-box:visible').find('.training-type').text() == 'Question') {
        /* Question Validations */
        let answerKeys = isJson(actionInstance.customProperties[5].value) ? JSON.parse(actionInstance.customProperties[5].value) : actionInstance.customProperties[5].value;
        let correct_ans_arr = [];
        let selected_answer = [];
        let check_counter = 0;
        let correct_answer = false;
        let attr_name = '';
        let is_checked = false;

        $('div.card-box:visible').find("input[type='checkbox']:checked").each(function(ind, ele) {
            if ($(ele).is(':checked')) {
                check_counter++;
                selected_answer.push($.trim($(ele).attr('id')));
                attr_name = $(ele).attr('name');
                data.push($(this).attr("id"))
                is_checked = true;
            }
        });
        if (!row[(pagination + 1)]) row[(pagination + 1)] = [];
        row[(pagination + 1)] = JSON.stringify(data);

        $('div.card-box:visible').find("input[type='radio']:checked").each(function(ind, ele) {
            if ($(ele).is(':checked')) {
                check_counter++;
                selected_answer.push($.trim($(ele).attr('id')));
                attr_name = $(ele).attr('name');

                if (!row[(pagination + 1)]) row[(pagination + 1)] = [];
                row[(pagination + 1)] = $(this).attr("id");

                is_checked = true;
            }
        });

        if (check_counter <= 0) {
            $('#next').prop('disabled', true);
        } else {
            $('#next').prop('disabled', false);
        }

        /* Validate if show answer is Yes */
        if (is_checked == true) {
            is_checked = false;
            let ans_res = [];
            $.each(selected_answer, function(i, selected_subarray) {
                if ($.inArray(selected_subarray, answerKeys[(attr_name - 1)]) !== -1) {
                    ans_res.push("true");
                } else {
                    ans_res.push("false");
                }
            });

            if ((answerKeys[(attr_name - 1)].length == ans_res.length) && ($.inArray("false", ans_res) == -1)) {
                correct_answer = true
            } else {
                correct_answer = false;
            }

            $('div.section-2').find('div.card-box').each(function(inde, ele) {
                if ($(ele).is(':visible')) {
                    summary_answer_resp[inde] = correct_answer;
                    return false;
                }
            });

            $.each(answerKeys[(attr_name - 1)], function(ii, subarr) {
                correct_ans_arr.push($.trim($('#' + subarr).text()));
            });

            let correct_value = correct_ans_arr.join();

            if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").parent('label').attr('disabled') !== "disabled") {
                if (correct_answer == true) {
                    /* If Correct Answer */
                    pagination++;

                    let limit = $('#y').text();
                    if (pagination < limit) {
                        $('#next').prop('disabled', false);
                        $('#back').prop('disabled', false);

                        $('div.section-2 > .container:first > div.card-box:nth-child(' + pagination + ')').hide();
                        if ($('div.section-2 > .container:first > div.card-box').length <= pagination) {
                            createTrainingSection(pagination);
                        } else {
                            $('div.section-2 > .container:first > div.card-box:nth-child(' + (pagination + 1) + ')').show();
                            setTimeout(
                                function() {
                                    if ($('div.card-box:visible').find('.training-type').text() == 'Question') {
                                        if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").parent('label').attr('disabled') !== "disabled") {
                                            $('#next').text('Check').attr('id', 'check');
                                        }
                                    }
                                }, 500);
                        }
                        $('#x').text((pagination + 1));

                    }
                } else {
                    /* If Incorrect */
                    let limit = $('#y').text();
                    pagination++;

                    if (pagination < limit) {
                        $('#next').prop('disabled', false);
                        $('#back').prop('disabled', false);

                        $('div.section-2 > .container:first > div.card-box:nth-child(' + pagination + ')').hide();
                        if ($('div.section-2 > .container:first > div.card-box').length <= pagination) {
                            createTrainingSection(pagination);
                        } else {
                            $('div.section-2 > .container:first > div.card-box:nth-child(' + (pagination + 1) + ')').show();
                            setTimeout(
                                function() {
                                    if ($('div.card-box:visible').find('.training-type').text() == 'Question') {
                                        if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").parent('label').attr('disabled') !== "disabled") {
                                            $('#next').text('Check').attr('id', 'check');
                                        }
                                    }
                                }, 500);
                        }
                        $('#x').text((pagination + 1));
                    } else {
                        /* Show Summary */
                        $('#next').prop('disabled', true);
                    }
                }
            } else {
                /* If Question is not answerable */
                let limit = $('#y').text();
                pagination++;

                if (pagination < limit) {
                    $('#next').prop('disabled', false);
                    $('#back').prop('disabled', false);

                    $('div.section-2 > .container:first > div.card-box:nth-child(' + pagination + ')').hide();
                    if ($('div.section-2 > .container:first > div.card-box').length <= pagination) {
                        createTrainingSection(pagination);
                    } else {
                        $('div.section-2 > .container:first > div.card-box:nth-child(' + (pagination + 1) + ')').show();
                        setTimeout(
                            function() {
                                if ($('div.card-box:visible').find('.training-type').text() == 'Question') {
                                    if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").parent('label').attr('disabled') !== "disabled") {
                                        $('#next').text('Check').attr('id', 'check');
                                    }
                                }
                            }, 500);
                    }
                    $('#x').text((pagination + 1));

                    $('div.section-2').find('div.card-box').each(function(inde, ele) {
                        if ($(ele).is(':visible')) {
                            summary_answer_resp[inde] = true;
                            return false;
                        }
                    });
                } else {
                    /* Show Summary */
                    $('#next').prop('disabled', true);
                    loadSummaryView();
                }
            }
        } else {
            Localizer.getString('note_please_choose_choice').then(function(result) {
                $('div.section-2').find('div.card-box:visible').prepend(`<div class="alert alert-danger error-msg">${result}</div>`);
            });
        }

        if (pagination >= limit) {
            loadSummaryView();
        }
    } else {
        /* Not Question Type */
        pagination++;
        limit = $('#y').text();
        row[pagination] = 'question' + pagination;

        if (pagination < limit) {
            $('#next').prop('disabled', false);
            $('#back').prop('disabled', false);

            $('div.section-2 > .container:first > div.card-box:nth-child(' + pagination + ')').hide();
            if ($('div.section-2 > .container:first > div.card-box').length <= pagination) {
                createTrainingSection(pagination);
            } else {
                $('div.section-2 > .container:first > div.card-box:nth-child(' + (pagination + 1) + ')').show();
                setTimeout(
                    function() {
                        if ($('div.card-box:visible').find('.training-type').text() == 'Question') {
                            if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").parent('label').attr('disabled') !== "disabled") {
                                $('#next').text('Check').attr('id', 'check');
                            }
                        }
                    }, 500);
            }
            $('#x').text((pagination + 1));
        } else {
            /* Show Summary */
            $('#next').prop('disabled', true);
            loadSummaryView();
        }
        if (pagination >= limit) {
            loadSummaryView();
        }
    }

});

/*
 * Event to click on back button
 */
$(document).on('click', '#back', function() {

    if ($('.error-msg').length > 0)
        $('.error-msg').remove();

    if ($('#check').length > 0) {
        $('#check').text('Next').attr('id', 'next');
    }
    if (pagination < 1) {
        $('#back').prop('disabled', true);
    } else {
        $('#back').prop('disabled', false);
        $('#next').prop('disabled', false);

        $('div.section-2 > .container:first > div.card-box:nth-child(' + (pagination + 1) + ')').hide();
        $('div.section-2 > .container:first > div.card-box:nth-child(' + pagination + ')').show();

        setTimeout(
            function() {
                if ($('div.card-box:visible').find('.training-type').text() == 'Question') {
                    if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").parent('label').attr('disabled') !== "disabled") {
                        $('#next').text('Check').attr('id', 'check');
                    }
                }
            }, 500);
        $('#x').text(pagination);
        pagination--;
    }
});
// *********************************************** OTHER ACTION END***********************************************

/**
 * Variable contains head section  
 */
let head_section1 = `<div class="card-box card-bg card-border">
                            <h4 id="section1-training-title">My Training title</h4>
                            <p class="text-justify" id="section1-training-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                                specimen book.</p>
                        </div>`;

/**
 * Variable contains text section
 */
let text_section1 = `<div class="card-box card-bg card-border">
                        <div class="form-group">
                            <div class="hover-btn ">
                                <label class="mb0"><strong><span class="counter">1</span>. <span class="training-type">Text</span></strong> </label><span class="float-right result"></span>
                            </div>
                            <div class="clearfix"></div>
                            <hr>
                        </div>
                        <p class="mb0 text-description text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                            specimen book.</p>
                    </div>`;

/**
 * Variable contains text section for media file
 */
let text_section3 = `<div class="card-box card-bg card-border">
                    <div class="form-group">
                        <div class="row">
                            <div class="col-9">
                                <div class="hover-btn ">
                                    <label class="mb0"><strong><span class="counter">1</span>. <span class="training-type">P</span></strong> </label><span class="float-right result"></span>
                                    <hr>
                                    <p class="mb0 text-description text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                        specimen book.</p>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="img-thumbnail">
                                    <img class="image-sec">                
                                </div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>                
                </div>`;

/**
 * Variable contains question section
 */
let question_section1 = `<div class="card-box card-bg card-border">
                            <div class="form-group">
                                <div class="hover-btn ">
                                    <label><strong><span class="counter">2</span>. <span class="question-title">Question with two option</span></strong> </label><span class="float-right result"></span>
                                    <button type="button" class="close remove-question" data-dismiss="alert">
                                        <span aria-hidden="true">
                                            
                                        </span>
                                        <span class="sr-only">Close</span>
                                    </button>
                                </div>
                                <div class="clearfix"></div>
                                <hr>
                            </div>
                            <label><strong><span class="question-title-main">My new Question</span></strong></label>
                        </div>`;

/**
 * Variable contains footer section
 */
let footer_section1 = `<div class="footer section-1-footer">
                            <div class="footer-padd bt">
                                <div class="container ">
                                    <div class="row">
                                        <div class="col-4"> </div>
                                        <div class="col-4 text-center"> </div>
                                        <div class="col-4 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right" id="start"> Start</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

/**
 * Variable contains text section
 */
let text_section2 = `<div class="card-box card-bg card-border">
                        <div class="form-group">
                            <div class="hover-btn ">
                                <label><strong><span class="counter">1</span>. <span class="section-type-title">Text</span></strong> </label>
                                <button type="button" class="close remove-question" data-dismiss="alert">
                                    <span aria-hidden="true">
                                        
                                    </span>
                                    <span class="sr-only">Close</span>
                                </button>
                            </div>
                            <div class="clearfix"></div>
                            <hr>
                        </div>
                        <p class="mb0 text-description text-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                            specimen book.</p>
                    </div>`;

/**
 * Variable contains footer section
 */
let footer_section2 = `<div class="footer section-2-footer">
                            <div class="footer-padd bt">
                                <div class="container ">
                                    <div class="row">
                                        <div class="col-4"> <button type="button" class="btn btn-primary-outline btn-sm " id="back"> Back</button></div>
                                        <div class="col-4 text-center" id="xofy"> <span id="x">1</span> of <span id="y">4</span></div>
                                        <div class="col-4 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right" id="next"> Next</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

/**
 * Variable contains footer section
 */
let footer_section3 = `<div class="footer section-3-footer">
                            <div class="footer-padd bt">
                                <div class="container ">
                                    <div class="row">
                                    <div class="col-4"> </div>
                                    <div class="col-2 text-center"> </div>
                                    <div class="col-6 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right submit-form" id="submit"> Complete Training</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
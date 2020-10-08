import * as actionSDK from "@microsoft/m365-action-sdk";
import { Localizer } from '../common/ActionSdkHelper';

// ActionSDK.APIs.actionViewDidLoad(true /*success*/ );

// Fetching HTML Elements in Variables by ID.
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
let choiceAnyChoiceKey = '';
let continueKey = '';
let answerResponseKey = '';
let correctKey = '';
let yourAnswerKey = '';
let incorrectKey = '';
let correctAnswerKey = '';
let yourAnswerRightKey = '';
let yourAnswerIsKey = ''
let rightAnswerIsKey = '';
let submitKey = '';
let quizSummaryKey = '';
let nextKey = '';
let backKey = '';
let quizExpiredKey = '';

/* Async method for fetching localization strings */
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

}

async function getTheme(request) {
    let response = await actionSDK.executeApi(request);
    let context = response.context;
    console.log("getContext response: ");
    console.log(JSON.stringify(context));
    $("form.section-1").show();
    let theme = context.theme;
    console.log(`theme: ${context.theme}`)
    $("link#theme").attr("href", "css/style-" + theme + ".css");

    $('div.section-1').append(`<div class="row"><div class="col-12"><div id="root"></div></div></div>`);
    $root = $("#root")

    setTimeout(() => {
        $('div.section-1').show();
        $('div.footer').show();
    }, 1000);
    await actionSDK.executeApi(new actionSDK.HideLoadingIndicator.Request());

    OnPageLoad();
}

/* 
 * @desc Method get Responder Details  
 * @param action context id
 */
async function getResponderIds(actionId) {
    actionSDK
        .executeApi(new actionSDK.GetActionDataRows.Request(actionId))
        .then(function(batchResponse) {
            actionDataRows = batchResponse.dataRows;
            actionDataRowsLength = actionDataRows == null ? 0 : actionDataRows.length;

            if (actionDataRowsLength > 0) {
                for (let i = 0; i < actionDataRowsLength; i++) {
                    memberIds.push(actionDataRows[i].creatorId);
                }
            }

            console.log('memberIds: ');
            console.log(memberIds);
        })
        /* .catch(function(error) {
            console.error("Console log: Error: " + JSON.stringify(error));
        }) */
    ;
}

// *********************************************** HTML ELEMENT***********************************************
$(document).ready(function() {
    request = new actionSDK.GetContext.Request();
    getTheme(request);
});

function OnPageLoad() {
    actionSDK
        .executeApi(request)
        .then(function(response) {
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

function getActionInstance(actionId) {
    actionSDK
        .executeApi(new actionSDK.GetAction.Request(actionId))
        .then(function(response) {
            console.info("Response: " + JSON.stringify(response));
            actionInstance = response.action;
            createBody();
        })
        .catch(function(error) {
            console.log("Error: " + JSON.stringify(error));
        });
}

function createBody() {

    /* Check if already responded */
    if ($.inArray(myUserId, memberIds) > -1) {
        getStringKeys();
        // $('div.section-1').append('<hr>');

        Localizer.getString('alreadyTired').then(function(result) {
            $('div.section-1').append(`<div><b> ${result} </b></div>`);
        });
        /* Localizer.getString('notConsideredFinalScore').then(function(result) {
            $('div.section-1').append(`<div><small>${result}</small></div>`);
        }); */
        // $('div.ection-1').append('<div class="section-2"></div>');
        // loadSummaryView();
        // $('div.section-1').after(footer_section1);
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
        let req = new actionSDK.GetAttachmentInfo.Request(actionInstance.customProperties[4].value);

        actionSDK.executeApi(req)
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
                        $('div.card-box:last').find('span.counter').text(counter);
                        $('div.card-box:last').find('.text-description').text(text_title);


                        $('div.card-box:last').find('span.training-type').text('Photo');
                        $('div.card-box:last').find("img.image-sec").attr('id', data.name);
                        let dname = isJson(data.options[0].displayName) ? JSON.parse(data.options[0].displayName) : data.options[0].displayName;
                        let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                        if (attachment != undefined) {
                            let attachment_img = '';
                            $.each(attachment, function(ind, att) {
                                attachment_img = att;
                                return false;
                            });
                            let req = new actionSDK.GetAttachmentInfo.Request(attachment_img);
                            let filesAmount = Object.keys(attachment).length;
                            actionSDK.executeApi(req)
                                .then(function(response) {
                                    console.info("Attachment - Response: " + JSON.stringify(response));
                                    $("img#" + data.name).attr('src', response.attachmentInfo.downloadUrl);
                                    if (filesAmount > 1)
                                        $("img#" + data.name).after(`<span class="file-counter">+${filesAmount-1}</span>`);
                                })
                                .catch(function(error) {
                                    console.error("AttachmentAction - Error: " + JSON.stringify(error));
                                });

                            console.log('filesAmount: ' + filesAmount);
                        }
                    } else if (data.name.indexOf("document") >= 0) {
                        $('div.section-1').append(text_section3);
                        $('div.card-box:last').find('span.counter').text(counter);
                        $('div.card-box:last').find('.text-description').text(text_title);
                        $('div.card-box:last').find("img.image-sec").attr('id', data.name);
                        $('div.card-box:last').find('span.training-type').text('Document');
                        $("img#" + data.name).attr('src', 'images/doc.png');

                        /* let dname = JSON.parse(data.options[0].displayName)
                        let attachment = JSON.parse(dname.attachmentId);
                        let req = new actionSDK.GetAttachmentInfo.Request(attachment[0]);

                        actionSDK.executeApi(req)
                            .then(function(response) {
                                console.info("Attachment - Response: " + JSON.stringify(response));
                                $("img#" + data.name).attr('src', response.attachmentInfo.downloadUrl);
                                
                            })
                            .catch(function(error) {
                                console.error("AttachmentAction - Error: " + JSON.stringify(error));
                            }); */

                    } else if (data.name.indexOf("video") >= 0) {
                        $('div.section-1').append(text_section3);
                        $('div.card-box:last').find('span.counter').text(counter);
                        $('div.card-box:last').find('.text-description').text(text_title);
                        $('div.card-box:last').find('span.training-type').text('Video');
                        $('div.card-box:last').find("img.image-sec").remove();
                        $('div.card-box:last').attr("id", data.name);

                        let dname = isJson(data.options[0].displayName) ? JSON.parse(data.options[0].displayName) : data.options[0].displayName;
                        let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                        if (attachment != undefined) {
                            let req = new actionSDK.GetAttachmentInfo.Request(attachment[0]);
                            actionSDK.executeApi(req)
                                .then(function(response) {
                                    console.info("Attachment - Response: " + JSON.stringify(response));
                                    $('#' + data.name).find(".img-thumbnail").append('<div class="embed-responsive embed-responsive-4by3"><video controls="" class="video" id="' + data.name + '" src="' + response.attachmentInfo.downloadUrl + '"></video></div>');
                                })
                                .catch(function(error) {
                                    console.error("AttachmentAction - Error: " + JSON.stringify(error));
                                });
                        }
                    } else {
                        /* text */
                        $('div.section-1').append(text_section1);
                        $('div.card-box:last').find('span.counter').text(counter);
                        $('div.card-box:last').find('.text-description').text(text_title);

                    }

                } else if (data.valueType == 'SingleOption' || data.valueType == 'MultiOption') {
                    /* Call Question Section 1 */
                    let counter = $('div.card-box').length;
                    let text_title = data.displayName.length > 100 ? data.displayName.substr(0, data.displayName.lastIndexOf(' ', 97)) + '...' : data.displayName;
                    $('div.section-1').append(question_section1);
                    $('div.card-box:last').find('span.counter').text(counter);
                    $('div.card-box:last').find('.question-title').text(`Question with ${numbertowords(Object.keys(data.options).length)} options`);
                    $('div.card-box:last').find('.question-title-main').text(text_title);
                }
            });
        });

        $('div.section-1').append(`<div class="container pb-100"></div>`);
        $('div.section-1').after(footer_section1);
    }


}

$(document).on('click', '.submit-form', function() {
    submitForm();
})

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

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

                console.log("choice occurance" + choice_occurance);
                console.log("question" + question.valueType);

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

function getRadioButton(text, name, id) {
    let $div_data = $(`<div class="form-group radio-section custom-radio-outer" id="${id}" columnId="${name}" ><label class="custom-radio"><input type="radio" name="${name}" id="${id}"> <span class="radio-block"></span> ${text}</label></div>`)
    return $div_data;
}

function getCheckboxButton(text, name, id) {
    /* let $oDiv = $('<div class="form-group radio-section custom-check-outer" id="' + id + '" columnId="' + name + '" ></div>');
    let $soDiv = $('<label class="custom-check form-check-label"></label>');
    let radiobox = '<input type="checkbox" class="form-check-input" name="' + name + '" id="' + id + '">';
    let $lDiv = $(radiobox + ' <span class="checkmark"></span>' + text);
    $oDiv.append($soDiv);
    $soDiv.append($lDiv);
    return $oDiv; */
    let div_data = $(`<div class="form-group radio-section custom-check-outer" id="${id}" columnId="${name}" ><label class="custom-check form-check-label"><input type="checkbox" class="form-check-input" name="${name}" id="${id}"><span class="checkmark"></span> ${text}</label></div>`)
    return div_data;
}

/* $(document).on('click', 'div.radio-section', function() {
    radiobuttonclick($(this).id, $(this).attr('columnId'));
}) */


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

function loadSummaryView() {
    console.log('call');
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
                        $('div.card-box:last').find('.training-type').text('Photo');
                    } else if (data.name.indexOf("video") >= 0) {
                        $('div.card-box:last').find('.training-type').text('Video');

                    } else if (data.name.indexOf("document") >= 0) {
                        $('div.card-box:last').find('.training-type').text('Document');

                    }
                } else if (data.valueType == 'SingleOption' || data.valueType == 'MultiOption') {
                    /* Call Question Section 1 */
                    let counter = $('.section-3 div.card-box').length;
                    let text_title = data.displayName.length > 100 ? data.displayName.substr(0, data.displayName.lastIndexOf(' ', 97)) + '...' : data.displayName;
                    $('div.section-3 .container:first').append(question_section1);
                    $('div.card-box:last').find('span.counter').text(counter);
                    $('div.card-box:last').find('.question-title').text(`Question with ${numbertowords(Object.keys(data.options).length)} options`);
                    $('div.card-box:last').find('.question-title-main').text(text_title);
                    if (actionInstance.customProperties[3].value == 'Yes') {
                        $('div.card-box:last').find('.result').html(summary_answer_resp[ind] == true ? `<span class="float-right result text-success"><i class="fa fa-check" aria-hidden="true"></i> Correct</span>` : `<span class="float-right result text-danger"><i class="fa fa-remove" aria-hidden="true"></i> Incorrect</span>`);
                    }
                }
            });
        });
    }

    console.log(`summary_answer_resp ${summary_answer_resp}`);
}


// *********************************************** HTML ELEMENT END***********************************************

// *********************************************** SUBMIT ACTION***********************************************

function submitForm() {
    actionSDK
        .executeApi(new actionSDK.GetContext.Request())
        .then(function(response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            addDataRows(response.context.actionId);
        })
        .catch(function(error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        });
}

/* function radiobuttonclick(questionResponse, colomnId) {
    let data = [];
    row = {};
    $.each($("input[type='checkbox']:checked"), function(ind, v) {
        let col = $(this).parents("div.form-group").attr("columnid");
        data.push($(this).attr("id"));

        if (!row[col]) row[col] = [];
        row[col] = JSON.stringify(data);

        $('#next').prop('disabled', false);
    });

    $.each($("input[type='radio']:checked"), function() {
        let col = $(this).parents("div.form-group").attr("columnid");

        if (!row[col]) row[col] = [];
        row[col] = $(this).attr("id");

        $('#next').prop('disabled', false);

    });


    // console.log(row);
} */

function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function getDataRow(actionId) {
    let data = {
        id: generateGUID(),
        actionId: actionId,
        dataTableId: "TestDataSet",
        columnValues: row,
    };
    console.log("data-:  " + JSON.stringify(data));
    console.log(data);
    return data;
}

function addDataRows(actionId) {
    let addDataRowRequest = new actionSDK.AddActionDataRow.Request(
        getDataRow(actionId)
    );
    let closeViewRequest = new actionSDK.CloseView.Request();
    let batchRequest = new actionSDK.BaseApi.BatchRequest([
        addDataRowRequest,
        closeViewRequest,
    ]);
    actionSDK
        .executeBatchApi(batchRequest)
        .then(function(batchResponse) {
            console.info("BatchResponse: " + JSON.stringify(batchResponse));
        })
        .catch(function(error) {
            console.error("Error: " + JSON.stringify(error));
        });
}

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
                        console.log(`counter tet ${counter}`);

                        if (data.name.indexOf("photo") >= 0) {

                            $('div.section-2 > .container:first > div.card-box:last').find('span.section-type-title').text('Photo');

                            let dname = isJson(data.options[0].displayName) ? JSON.parse(data.options[0].displayName) : data.options[0].displayName;
                            let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                            let $carousel = $('<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel"></div>');
                            let $ol_section = $('<ol class="carousel-indicators"></ol>');
                            let $carousel_inner = $('<div class="carousel-inner"></div>');

                            if (attachment != undefined) {
                                let filesAmount = Object.keys(attachment).length;

                                $carousel.append($ol_section);
                                $carousel.append($carousel_inner);
                                console.log('filesAmount: ' + filesAmount);

                                let count = 0;
                                $.each(attachment, function(i, att) {
                                    let req = new actionSDK.GetAttachmentInfo.Request(att);
                                    console.log('count: ' + count);

                                    actionSDK.executeApi(req)
                                        .then(function(response) {

                                            let $img_div = $(`<div class="carousel-item ${count == 0 ? 'active' : ''}">
                                                            <img class="d-block w-100" src="${response.attachmentInfo.downloadUrl}" alt="${count+1} slide">
                                                        </div>`);
                                            $carousel_inner.append($img_div);
                                            console.log('count:' + count);
                                            console.log('filesAmount:' + filesAmount);

                                            if (count == (filesAmount - 1)) {
                                                console.log('start here:');
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
                                            console.log($carousel);
                                            console.info("Attachment - Response: " + JSON.stringify(response));
                                            count++;
                                        })
                                        .catch(function(error) {
                                            console.error("AttachmentAction - Error: " + JSON.stringify(error));
                                        });
                                })

                            }
                        } else if (data.name.indexOf("document") >= 0) {
                            $('div.section-2 > .container:first > div.card-box:last').find('span.section-type-title').text('Document');
                            // $('div.section-2 > .container:first > div.card-box:last').find('.text-description').before("<img id='" + data.name + "' src='images/doc.png' >");

                            let dname = isJson(data.options[0].displayName) ? JSON.parse(data.options[0].displayName) : data.options[0].displayName;
                            let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                            let req = new actionSDK.GetAttachmentInfo.Request(attachment[0]);

                            actionSDK.executeApi(req)
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
                            $('div.section-2 > .container:first > div.card-box:last').find('span.section-type-title').text('Video');
                            $('div.section-2 > .container:first > div.card-box:last').find("img.image-sec").remove();
                            $('div.section-2 > .container:first > div.card-box:last').attr("id", data.name);

                            let dname = isJson(data.options[0].displayName) ? JSON.parse(data.options[0].displayName) : data.options[0].displayName;
                            let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                            let req = new actionSDK.GetAttachmentInfo.Request(attachment[0]);
                            actionSDK.executeApi(req)
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
                        console.log(`counter  ${counter}`);
                    }
                }
            });
        }
    });
}

// *********************************************** SUBMIT ACTION END***********************************************
// *********************************************** OTHER ACTION STARTS***********************************************
let pagination = 0;
$(document).on('click', '#start', function() {
    $('div.section-1').hide();
    $('div.section-1-footer').hide();
    $('div.section-1').after(`<div class="section-2"><div class="container pt-4"></div></div>`);

    /* Show first section */
    // $('div.section-2 .container').html(text_section2);
    $('div.section-2').after(footer_section2);
    $('div.section-2').append(`<div class="container pb-100"></div>`);

    createTrainingSection(pagination);
    $('#back').prop('disabled', true);

    console.log(pagination);

});

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
            // selected_answer.push($.trim($(ele).parent('label').text()));
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
        // summary_answer_resp.push(correct_answer);

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
                                    <span class="float-right result"><span class="float-right result text-success"><i class="fa fa-check" aria-hidden="true"></i> Correct</span></span>
                                    <button type="button" class="close remove-question" data-dismiss="alert">
                                        <span aria-hidden="true">
                                            
                                        </span>
                                        <span class="sr-only">Close</span>
                                    </button>
                                </div>
                                <div class="clearfix"></div>
                                <hr>
                            </div>
                            <label><strong>Correct answer is: </strong> <span class="question-title-main">${correct_value}</span></label>
                        </div>`);

                $('#check').text('Next').attr('id', 'next');

            } else {
                $('div.card-box:last').find('.result').remove();
                $('div.card-box:last').append(`
                        <div class="result">
                        <hr>
                            <div class="form-group">
                                <div class="hover-btn ">
                                    <label><strong><span class="question-title">Result</span></strong> </label><span class="float-right result"><span class="float-right result text-danger"><i class="fa fa-remove" aria-hidden="true"></i> Incorrect</span></span>
                                    <button type="button" class="close remove-question" data-dismiss="alert">
                                        <span aria-hidden="true">
                                            
                                        </span>
                                        <span class="sr-only">Close</span>
                                    </button>
                                </div>
                                <div class="clearfix"></div>
                                <hr>
                            </div>
                            <label><strong>Correct answer is: </strong> <span class="question-title-main">${correct_value}</span></label>
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
        $('div.section-2').find('div.card-box:visible').prepend(`<div class="alert alert-danger error-msg">Note! Please choose any choice</div>`);
    }

});

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

        console.log('Question: ');

        $('div.card-box:visible').find("input[type='checkbox']:checked").each(function(ind, ele) {
            if ($(ele).is(':checked')) {
                check_counter++;
                // selected_answer.push($.trim($(ele).parent('label').text()));
                selected_answer.push($.trim($(ele).attr('id')));
                attr_name = $(ele).attr('name');
                data.push($(this).attr("id"));

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
            // summary_answer_resp.push(correct_answer);

            $.each(answerKeys[(attr_name - 1)], function(ii, subarr) {
                correct_ans_arr.push($.trim($('#' + subarr).text()));
            });

            let correct_value = correct_ans_arr.join();

            if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").parent('label').attr('disabled') !== "disabled") {
                if (correct_answer == true) {
                    /* If Correct Answer */
                    pagination++;

                    let limit = $('#y').text();
                    console.log(`${pagination} < ${limit}`);
                    if (pagination < limit) {
                        $('#next').prop('disabled', false);
                        $('#back').prop('disabled', false);

                        $('div.section-2 > .container:first > div.card-box:nth-child(' + pagination + ')').hide();
                        console.log(`next section ${$('div.section-2 > .container:first > div.card-box').length} <= ${pagination}`)
                        if ($('div.section-2 > .container:first > div.card-box').length <= pagination) {
                            createTrainingSection(pagination);
                        } else {
                            console.log(pagination);
                            $('div.section-2 > .container:first > div.card-box:nth-child(' + (pagination + 1) + ')').show();
                            console.log(pagination + 1);
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
                    console.log(`${pagination} < ${limit}`);

                    if (pagination < limit) {
                        $('#next').prop('disabled', false);
                        $('#back').prop('disabled', false);

                        $('div.section-2 > .container:first > div.card-box:nth-child(' + pagination + ')').hide();
                        console.log(`next section ${$('div.section-2 > .container:first > div.card-box').length} <= ${pagination}`)
                        if ($('div.section-2 > .container:first > div.card-box').length <= pagination) {
                            createTrainingSection(pagination);
                        } else {
                            console.log(pagination);
                            $('div.section-2 > .container:first > div.card-box:nth-child(' + (pagination + 1) + ')').show();
                            console.log(pagination + 1);
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
                console.log(`${pagination} < ${limit}`);


                if (pagination < limit) {
                    $('#next').prop('disabled', false);
                    $('#back').prop('disabled', false);

                    $('div.section-2 > .container:first > div.card-box:nth-child(' + pagination + ')').hide();
                    console.log(`next section ${$('div.section-2 > .container:first > div.card-box').length} <= ${pagination}`)
                    if ($('div.section-2 > .container:first > div.card-box').length <= pagination) {
                        createTrainingSection(pagination);
                    } else {
                        console.log(pagination);
                        $('div.section-2 > .container:first > div.card-box:nth-child(' + (pagination + 1) + ')').show();
                        console.log(pagination + 1);
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

                    // summary_answer_resp.push(true);

                } else {
                    /* Show Summary */
                    $('#next').prop('disabled', true);
                    loadSummaryView();
                }


            }
        } else {
            $('div.section-2').find('div.card-box:visible').prepend(`<div class="alert alert-danger error-msg">Note! Please choose any choice</div>`);
        }

        if (pagination >= limit) {
            loadSummaryView();
        }
    } else {
        /* Not Question Type */
        pagination++;
        limit = $('#y').text();
        console.log(`${pagination} < ${limit}`);
        row[pagination] = 'question' + pagination;

        if (pagination < limit) {

            $('#next').prop('disabled', false);
            $('#back').prop('disabled', false);

            $('div.section-2 > .container:first > div.card-box:nth-child(' + pagination + ')').hide();
            console.log(`next section ${$('div.section-2 > .container:first > div.card-box').length} <= ${pagination}`)
            if ($('div.section-2 > .container:first > div.card-box').length <= pagination) {
                createTrainingSection(pagination);
            } else {
                console.log(pagination);
                $('div.section-2 > .container:first > div.card-box:nth-child(' + (pagination + 1) + ')').show();
                console.log(pagination + 1);
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

$(document).on('click', '#back', function() {
    console.log(`${pagination} <= 1`)

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

let footer_section = `<div class="footer" style="display:none;">
        <div class="footer-padd bt">
            <div class="container ">
                <div class="row">

                    <div class="col-12 text-right">
                        <button class="btn btn-primary btn-sm float-right submit-form">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

let head_section1 = `<div class="card-box card-bg card-border">
                            <h4 id="section1-training-title">My Training title</h4>
                            <p class="text-justify" id="section1-training-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                                specimen book.</p>
                        </div>`;

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

let text_section3 = `<div class="card-box card-bg card-border">
                    <div class="form-group">
                        <div class="row">
                            <div class="col-9">
                                <div class="hover-btn ">
                                    <label class="mb0"><strong><span class="counter">1</span>. <span class="training-type">Text</span></strong> </label><span class="float-right result"></span>
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
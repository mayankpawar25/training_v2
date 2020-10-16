import { Localizer, ActionHelper } from '../common/ActionSdkHelper';

$(document).ready(function() {
    OnPageLoad();
});

let actionContext = null;
let actionInstance = null;
let actionSummary = null;
let actionDataRows = null;
let actionDataRowsLength = 0;
let ResponderDate = [];
let actionNonResponders = [];
let myUserId = "";
let score = 0;
let total = 0;
let answer_is = "";
let data_response = "";

let backKey = "";
let dueByKey = "";
let expiredOnKey = "";
let correctKey = "";
let incorrectKey = "";
let youKey = "";
let request = ActionHelper.getContextRequest();
let root = document.getElementById("root");
getTheme(request);

/* 
 * Method for fetching localization strings 
 */
async function getStringKeys() {
    Localizer.getString('dueBy').then(function(result) {
        dueByKey = result;
    });

    Localizer.getString('expired_on').then(function(result) {
        expiredOnKey = result;
    });

    Localizer.getString('correct').then(function(result) {
        correctKey = result;
    });
    Localizer.getString('incorrect').then(function(result) {
        incorrectKey = result;
    });

    Localizer.getString('responders').then(function(result) {
        $('.responder-key').text(result);
    });

    Localizer.getString('non_responders').then(function(result) {
        $('.non-responder-key').text(result);
    });

    Localizer.getString('you').then(function(result) {
        youKey = result;
    });
}

/* 
 * Method to get theme color 
 * @param request object
 */
async function getTheme(request) {
    getStringKeys();
    data_response = await ActionHelper.executeApi(request);
    let context = data_response.context;
    $("form.section-1").show();
    let theme = context.theme;
    $("link#theme").attr("href", "css/style-" + theme + ".css");
    ActionHelper.hideLoader();
}

/* 
 * Method to create app body when page load
 */
function OnPageLoad() {
    ActionHelper.executeApi(request)
        .then(function(response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            actionContext = response.context;
            getDataRows(response.context.actionId);
        })
        .catch(function(error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        });
}

/* 
 * Method to get data rows
 * @param actionId number
 */
function getDataRows(actionId) {
    let getActionRequest = ActionHelper.getActionRequest(actionId);
    let getSummaryRequest = ActionHelper.getDataRowSummary(actionId, true);
    let getDataRowsRequest = ActionHelper.requestDataRows(actionId);
    let batchRequest = ActionHelper.batchRequest([getActionRequest, getSummaryRequest, getDataRowsRequest]);
    ActionHelper.executeBatchApi(batchRequest).then(function(batchResponse) {
        console.info("BatchResponse: " + JSON.stringify(batchResponse));
        actionInstance = batchResponse.responses[0].action;
        actionSummary = batchResponse.responses[1].summary;
        actionDataRows = batchResponse.responses[2].dataRows;
        actionDataRowsLength = actionDataRows == null ? 0 : actionDataRows.length;
        createBody();
    }).catch(function(error) {
        console.log("Console log: Error: " + JSON.stringify(error));
    });
}

/* 
 * Method to create boady
 */
async function createBody() {
    let getSubscriptionCount = "";
    $("#root").html("");

    /*  Head Section  */
    head();

    /*  Person Responded X of Y Responses  */
    getSubscriptionCount = ActionHelper.getSubscriptionMemberCount(actionContext.subscription);

    let response = await ActionHelper.executeApi(getSubscriptionCount);

    let $pcard = $('<div class="progress-section"></div>');

    let memberCount = response.memberCount;
    let participationPercentage = 0;

    participationPercentage = Math.round(
        (actionSummary.rowCreatorCount / memberCount) * 100
    );

    Localizer.getString('participation', participationPercentage).then(function(result) {
        $pcard.append(`<label><strong>${result} </strong></label><div class="progress mb-2"><div class="progress-bar bg-primary" role="progressbar" style="width:${participationPercentage}%" aria-valuenow="${participationPercentage}" aria-valuemin="0" aria-valuemax="100"></div></div>`);
    });

    Localizer.getString('xofy_people_responded', actionSummary.rowCount, memberCount).then(function(result) {
        $pcard.append(`<p class="date-color cursur-pointer md-0" id="show-responders">${result}</p>`);
    });

    $("#root").append($pcard);

    await getUserprofile();
    if (myUserId == data_response.context.userId) {
        createCreatorQuestionView(myUserId, ResponderDate);
        return false;
    } else {
        ResponderDate.forEach((responder) => {
            if (responder.value2 == myUserId) {
                createReponderQuestionView(myUserId, responder);
                return false;
            }
        });
    }
    return true;
}

/* 
 * Method to get head
 */
function head() {
    let title = actionInstance.displayName;
    let description = actionInstance.customProperties[0]["value"];
    let dueby = new Date(actionInstance.expiryTime).toDateString();

    let $card = $('<div class=""></div>');
    let $title_sec = $("<h4>" + title + "</h4>");
    let $description_sec = $("<p class='text-justify'>" + description + "</p>");
    let $date_sec = '';
    Localizer.getString('dueBy').then(function(result) {
        $date_sec = $(`<p><small class="date-color md-0">${result} ${dueby}</small></p>`);
    });

    $card.append($title_sec);
    $card.append($description_sec);
    $card.append($date_sec);
    $card.append("<hr>");

    $("#root").append($card);
}

/* 
 * Method to get user profile
 */
async function getUserprofile() {
    let memberIds = [];
    ResponderDate = [];
    actionNonResponders = [];
    if (actionDataRowsLength > 0) {
        for (let i = 0; i < actionDataRowsLength; i++) {
            memberIds.push(actionDataRows[i].creatorId);
            let requestResponders = ActionHelper.getSusbscriptionMembers(actionContext.subscription, [actionDataRows[i].creatorId]);
            let responseResponders = await ActionHelper.executeApi(requestResponders);
            let perUserProfile = responseResponders.members;
            ResponderDate.push({
                label: perUserProfile[0].displayName,
                value: new Date(actionDataRows[i].updateTime).toDateString(),
                value2: perUserProfile[0].id,
            });
        }
    }

    myUserId = actionContext.userId;
    let requestNonResponders = ActionHelper.getSubscriptionNonParticipants(actionContext.actionId, actionContext.subscription.id);
    let responseNonResponders = await ActionHelper.executeApi(requestNonResponders);
    let tempresponse = responseNonResponders.nonParticipants;
    if (tempresponse != null) {
        for (let i = 0; i < tempresponse.length; i++) {
            actionNonResponders.push({
                label: tempresponse[i].displayName,
                value2: tempresponse[i].id,
            });
        }
    }
}

/* 
 * Method to get respponders list
 */
function getResponders() {
    $("table#responder-table tbody").html("");

    for (let itr = 0; itr < ResponderDate.length; itr++) {
        let id = ResponderDate[itr].value2;
        let name = "";
        if (ResponderDate[itr].value2 == myUserId) {
            name = youKey;
        } else {
            name = ResponderDate[itr].label;
        }
        let date = ResponderDate[itr].value;

        let matches = ResponderDate[itr].label.match(/\b(\w)/g); // [D,P,R]
        let initials = matches.join('').substring(0, 2); // DPR

        $(".tabs-content:first")
            .find("table#responder-table tbody")
            .append(
                `<tr id="${ResponderDate[itr].value2}" class="getresult cursur-pointer">
                    <td>
                        <div class="d-flex ">
                            <div class="avtar">
                                ${initials}
                            </div>
                            <div class="avtar-txt">${name}</div>
                        </div>
                    </td>
                    <td  class="text-right avtar-txt">
                        ${date}
                        <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="right-carate">
                            <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                            </path>
                            <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                            </path>
                        </svg>
                    </td>
                </tr>`
            );
    }
}

/* 
 * Method to get non responders list
 */
function getNonresponders() {
    $("table#non-responder-table tbody").html("");

    for (let itr = 0; itr < actionNonResponders.length; itr++) {
        let id = actionNonResponders[itr].value2;
        let name = "";
        if (actionNonResponders[itr].value2 == myUserId) {
            name = "You";
        } else {
            name = actionNonResponders[itr].label;
        }
        let matches = actionNonResponders[itr].label.match(/\b(\w)/g); // [D,P,R]
        let initials = matches.join('').substring(0, 2); // DPR

        let date = actionNonResponders[itr].value;
        $(".tabs-content:first")
            .find("table#non-responder-table tbody")
            .append(`<tr>
                <td>
                    <div class="d-flex">
                        <div class="avtar">
                            ${initials}
                        </div>
                        <div class="avtar-txt">${name}</div>
                    </div>
                </td>
            </tr>`);
    }
}

/* 
 * Event to get result based on userId
 */
$(document).on("click", ".getresult", function() {
    let userId = $(this).attr("id");
    $("#root").html("");
    head();
    $("#root").append($(".question-content").clone());
    createQuestionView(userId);

    footer(userId);
});

/* 
 * Method to create responder question view
 * @param userId string identifier 
 * @param responder object
 */
function createReponderQuestionView(userId, responder) {
    $("div#root > div.question-content").html("");
    let count = 1;
    answer_is = "";
    total = 0;
    score = 0;

    let name = responder.label;
    let matches = name.match(/\b(\w)/g); // [D,P,R]
    let initials = matches.join('').substring(0, 2); // DPR
    let $you_section = `<table class="table" cellspacing="0" id="responder-table">
                            <tbody>
                                <tr id="${myUserId}" class="getresult cursur-pointer">
                                    <td>
                                        <div class="d-flex ">
                                            <div class="avtar">
                                                ${initials}
                                            </div>
                                            <div class="avtar-txt">${name}</div>
                                        </div>
                                    </td>
                                    <td class="text-right avtar-txt">
                                        ${responder.value}
                                        <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="right-carate">
                                            <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                            </path>
                                            <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                            </path>
                                        </svg>
                                    </td>
                                </tr>
                            </tbody>
                        </table>`;
    $('#root').append($you_section);

    actionInstance.dataTables.forEach((dataTable) => {
        dataTable.dataColumns.forEach((question, ind) => {
            answer_is = "";
            let count = ind + 1;

            let $card_div = $(`<div class="card-blank"></div>`);
            let $form_group = $(`<div class="form-group"></div>`);
            let $row = $(`<div class="row"></div>`);
            let $hover_btn = $('<div class="hover-btn"></div>');
            $card_div.append($form_group);
            $form_group.append($row);
            if (question.name.indexOf("photo") >= 0) {
                /* Photo Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = '';
                $form_group.append($row);
                $row.append($col_9);
                Localizer.getString('photo').then(function(result) {
                    content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">${result}</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $col_9.append(content);
                });

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    });

                    let req = ActionHelper.getAttachmentInfo(attachment_img);
                    let filesAmount = Object.keys(attachment).length;
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);
                    ActionHelper.setAttachmentPreview(req, question.name, filesAmount, $img_thumbnail, $col_3, 'photo')
                    $row.append($col_3);
                }
                $form_group.append($row);
                $card_div.append($form_group);
                $("#root").append($card_div);
                $("#root").append('<hr>');
            } else if (question.name.indexOf("document") >= 0) {
                /* Document Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = '';
                $form_group.append($row);
                $row.append($col_9);
                Localizer.getString('document').then(function(result) {
                    content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">${result}</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $col_9.append(content);
                });

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    })
                    let req = ActionHelper.getAttachmentInfo(attachment_img);
                    let filesAmount = Object.keys(attachment).length;
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);
                    ActionHelper.setAttachmentPreview(req, question.name, filesAmount, $img_thumbnail, $col_3, 'document')
                    $row.append($col_3);
                }
                $form_group.append($row);
                $card_div.append($form_group);
                $("#root").append($card_div);
                $("#root").append('<hr>');
            } else if (question.name.indexOf("video") >= 0) {
                /* Video Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = '';

                $form_group.append($row);
                $row.append($col_9);
                Localizer.getString('video').then(function(result) {
                    content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">${result}</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $col_9.append(content);
                });
                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    });
                    let req = ActionHelper.getAttachmentInfo(attachment_img);
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);
                    ActionHelper.setAttachmentPreview(req, question.name, 1, $img_thumbnail, $col_3, 'video')
                    $row.append($col_3);
                }

                $form_group.append($row);
                $card_div.append($form_group);
                $("#root").append($card_div);
                $("#root").append('<hr>');
            } else {
                if (question.options.length > 1) {
                    /* Question Section */
                    let $rowdDiv = $('<div class="row"></div>');
                    let $qDiv = $('<div class="col-sm-12"></div>');
                    let $dflex = $("<div class='d-table'></div>");

                    $card_div.append($rowdDiv);
                    $rowdDiv.append($qDiv);

                    let $questionHeading = $(`<label class="mb0"></label>`);
                    $questionHeading.append(
                        "<strong>" + count + ". " + question.displayName + "</strong>"
                    );

                    $card_div.append($dflex);
                    $dflex.append($questionHeading);

                    $dflex.append(
                        '<label class="float-right mb0" id="status-' + question.name + '"></label>'
                    );

                    question.options.forEach((option) => {
                        /* User Responded */
                        let userResponse = [];
                        let userResponseAnswer = "";

                        for (let i = 0; i < actionDataRowsLength; i++) {
                            if (actionDataRows[i].creatorId == userId) {
                                userResponse = actionDataRows[i].columnValues;
                                let userResponseLength = Object.keys(userResponse).length;

                                for (let j = 1; j <= userResponseLength; j++) {
                                    if (isJson(userResponse[j])) {
                                        let userResponseAns = JSON.parse(userResponse[j]);
                                        let userResponseAnsLen = userResponseAns.length;
                                        if (userResponseAnsLen > 1) {
                                            for (let k = 0; k < userResponseAnsLen; k++) {
                                                if (userResponseAns[k] == option.name) {
                                                    userResponseAnswer = userResponseAns[k];
                                                } else {
                                                    continue;
                                                }
                                            }
                                        } else {
                                            userResponseAnswer = userResponseAns;
                                        }
                                    } else {
                                        if (userResponse[j] == option.name) {
                                            userResponseAnswer = userResponse[j];
                                        }
                                    }
                                }
                            }
                        }

                        /* Correct Answer */
                        let correctResponse = JSON.parse(
                            actionInstance.customProperties[5].value
                        );
                        let correctResponseLength = Object.keys(correctResponse).length;
                        let correctAnswer = "";
                        for (let j = 0; j < correctResponseLength; j++) {

                            let correctResponseAns = correctResponse[j];
                            let correctResponseAnsLen = correctResponseAns.length;
                            for (let k = 0; k < correctResponseAnsLen; k++) {
                                if (correctResponseAns[k] == option.name) {
                                    correctAnswer = correctResponseAns[k];
                                }
                            }
                        }


                        if (question.options.length > 1) {
                            let $radioOption = getOptions(
                                option.displayName,
                                question.name,
                                option.name,
                                userResponseAnswer,
                                correctAnswer,
                            );
                            $card_div.append($radioOption);

                            $card_div.find("#status-" + question.name).html(`<span class="${answer_is == 'Correct' ? 'text-success' : 'text-danger'}">${answer_is}</span>`);
                        }
                    });

                    if (answer_is == "Correct") {
                        score++;
                    }
                    $("#root").append($card_div);
                } else {
                    /* Text Section */
                    let $text_section = '';
                    let $clearfix = $(`<div class="clearfix"></div>`);
                    $form_group.append($hover_btn);
                    Localizer.getString('video').then(function(result) {
                        $text_section = $(`<label class="mb0"><strong><span class="counter">${count}</span>. 
                                        <span class="training-type">Text</span></strong></label>
                                        <span class="float-right result"></span>`);
                        $hover_btn.append($text_section);
                    });
                    $form_group.append($clearfix);
                    let $description_section = `<p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $card_div.append($description_section);
                }
                $("#root").append($card_div);
                $("#root").append('<hr>');
            }
        });
        count++;
    });


    $("#root").append('<div class="ht-100"></div>');

    total = count;
    let scorePercentage = Math.round((score / total) * 100);

    // $("#root > div.progress-section").after(`<div class=""><h4><strong>Score: </strong>${scorePercentage}%</h4></div>`);
}

/* 
 * Method to create creator questions view
 * @param userId string identifier 
 * @param responder_data object
 */
function createCreatorQuestionView(userId, responder_data) {
    $("div#root > div.question-content").html("");
    let count = 1;
    let total_responders = responder_data.length;
    answer_is = "";
    total = 0;
    score = 0;

    let $you_section = '';

    Localizer.getString('aggregrate_result').then(function(result) {
        $you_section = `<table class="table" cellspacing="0" id="responder-table">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex ">
                                            <h6>
                                                ${result}
                                            </h6>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>`;
        $('#root div.card-blank:first').before($you_section);
    });

    actionInstance.dataTables.forEach((dataTable) => {
        dataTable.dataColumns.forEach((question, ind) => {
            answer_is = "";
            let count = ind + 1;
            let correct_counter = 0;

            let $card_div = $(`<div class="card-blank"></div>`);
            let $form_group = $(`<div class="form-group"></div>`);
            let $row = $(`<div class="row"></div>`);
            let $hover_btn = $('<div class="hover-btn"></div>');
            $card_div.append($form_group);
            $form_group.append($row);
            if (question.name.indexOf("photo") >= 0) {
                /* Photo Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = '';
                $form_group.append($row);
                $row.append($col_9);
                Localizer.getString('photo').then(function(result) {
                    content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">${result}</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $col_9.append(content);
                });

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    });

                    let req = ActionHelper.getAttachmentInfo(attachment_img);
                    let filesAmount = Object.keys(attachment).length;
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);
                    ActionHelper.setAttachmentPreview(req, question.name, filesAmount, $img_thumbnail, $col_3, 'photo');
                    $row.append($col_3);
                }
                $form_group.append($row);
                $card_div.append($form_group);
                $("#root").append($card_div);
                $("#root").append('<hr>');
            } else if (question.name.indexOf("document") >= 0) {
                /* Document Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = '';

                $form_group.append($row);
                $row.append($col_9);

                Localizer.getString('document').then(function(result) {
                    content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">${result}</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $col_9.append(content);
                });

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    })
                    let req = ActionHelper.getAttachmentInfo(attachment_img);
                    let filesAmount = Object.keys(attachment).length;
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);
                    ActionHelper.setAttachmentPreview(req, question.name, filesAmount, $img_thumbnail, $col_3, 'document');
                    $row.append($col_3);
                }
                $form_group.append($row);
                $card_div.append($form_group);
                $("#root").append($card_div);
                $("#root").append('<hr>');
            } else if (question.name.indexOf("video") >= 0) {
                /* Video Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = '';


                $form_group.append($row);
                $row.append($col_9);
                Localizer.getString('video').then(function(result) {
                    content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">${result}</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $col_9.append(content);
                });

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    });
                    let req = ActionHelper.getAttachmentInfo(attachment_img);
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);

                    ActionHelper.setAttachmentPreview(req, question.name, 1, $img_thumbnail, $col_3, 'video');
                    $row.append($col_3);
                }

                $form_group.append($row);
                $card_div.append($form_group);
                $("#root").append($card_div);
                $("#root").append('<hr>');
            } else {
                if (question.options.length > 1) {
                    /* Question Section */
                    let $rowdDiv = $('<div class="row"></div>');
                    let $qDiv = $('<div class="col-sm-12"></div>');
                    let $dflex = $("<div class='d-table'></div>");

                    $card_div.append($rowdDiv);
                    $rowdDiv.append($qDiv);

                    let $questionHeading = $(`<label class="mb0"></label>`);
                    $questionHeading.append(
                        "<strong>" + count + ". " + question.displayName + "</strong>"
                    );

                    $card_div.append($dflex);
                    $dflex.append($questionHeading);

                    $dflex.append(
                        '<label class="float-right mb0" id="status-' + question.name + '"></label>'
                    );

                    question.options.forEach((option) => {
                        /* User Responded */
                        let userResponse = [];
                        let userResponseAnswer = "";

                        for (let i = 0; i < actionDataRowsLength; i++) {
                            userResponse = actionDataRows[i].columnValues;
                            let userResponseLength = Object.keys(userResponse).length;

                            for (let j = 1; j <= userResponseLength; j++) {
                                if (isJson(userResponse[j])) {
                                    let userResponseAns = JSON.parse(userResponse[j]);
                                    let userResponseAnsLen = userResponseAns.length;
                                    if (userResponseAnsLen > 1) {
                                        for (let k = 0; k < userResponseAnsLen; k++) {
                                            if (userResponseAns[k] == option.name) {
                                                userResponseAnswer = userResponseAns[k];
                                            } else {
                                                continue;
                                            }
                                        }
                                    } else {
                                        userResponseAnswer = userResponseAns;
                                    }
                                } else {
                                    if (userResponse[j] == option.name) {
                                        userResponseAnswer = userResponse[j];
                                    }
                                }
                            }
                        }

                        /* Correct Answer */
                        let correctResponse = JSON.parse(
                            actionInstance.customProperties[5].value
                        );
                        let correctResponseLength = Object.keys(correctResponse).length;
                        let correctAnswer = "";
                        for (let j = 0; j < correctResponseLength; j++) {

                            let correctResponseAns = correctResponse[j];
                            let correctResponseAnsLen = correctResponseAns.length;
                            for (let k = 0; k < correctResponseAnsLen; k++) {
                                if (correctResponseAns[k] == option.name) {
                                    correctAnswer = correctResponseAns[k];
                                }
                            }
                        }

                        if (correctAnswer.length > 0 && userResponseAnswer.length > 0 && correctAnswer == userResponseAnswer) {
                            correct_counter++;
                        }
                        if (question.options.length > 1) {
                            let $radioOption = getOptions(
                                option.displayName,
                                question.name,
                                option.name,
                                userResponseAnswer,
                                correctAnswer,
                            );
                            $card_div.append($radioOption);

                            if (actionDataRowsLength == 0) {
                                $card_div.find("#status-" + question.name).html(`<span class="text-success">0% Correct</span>`);
                            } else {
                                $card_div.find("#status-" + question.name).html(`<span class="text-success">${(correct_counter * 100) / actionDataRowsLength}% Correct</span>`);
                            }
                        }
                    });

                    if (answer_is == "Correct") {
                        score++;
                    }
                    $("#root").append($card_div);
                } else {
                    /* Text Section */
                    let $text_section = '';
                    let $clearfix = $(`<div class="clearfix"></div>`);
                    $form_group.append($hover_btn);
                    Localizer.getString('text').then(function(result) {
                        $text_section = $(`<label class="mb0"><strong><span class="counter">${count}</span>. 
                                            <span class="training-type">${result}</span></strong></label>
                                            <span class="float-right result"></span>`);
                        $hover_btn.append($text_section);
                    });
                    $form_group.append($clearfix);

                    let $description_section = `<p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $card_div.append($description_section);
                }
                $("#root").append($card_div);
                $("#root").append('<hr>');
            }
        });
        count++;
    });


    $("#root").append('<div class="ht-100"></div>');

    total = count;
    let scorePercentage = Math.round((score / total) * 100);
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

/*
 * Method to create question view
 * @param userId string identifier
 */
function createQuestionView(userId) {
    total = 0;
    score = 0;
    $("div#root > div.question-content").html("");
    let count = 1;
    actionInstance.dataTables.forEach((dataTable) => {
        dataTable.dataColumns.forEach((question, ind) => {
            answer_is = "";
            let count = ind + 1;

            let $card_div = $(`<div class="card-blank"></div>`);
            let $form_group = $(`<div class="form-group"></div>`);
            let $row = $(`<div class="row"></div>`);
            let $hover_btn = $('<div class="hover-btn"></div>');
            $card_div.append($form_group);
            $form_group.append($row);
            if (question.name.indexOf("photo") >= 0) {
                /* Photo Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = '';
                $form_group.append($row);
                $row.append($col_9);
                Localizer.getString('photo').then(function(result) {
                    content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">${result}</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $col_9.append(content);
                });

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    });

                    let req = ActionHelper.getAttachmentInfo(attachment_img);
                    let filesAmount = Object.keys(attachment).length;
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);

                    ActionHelper.setAttachmentPreview(req, question.name, filesAmount, $img_thumbnail, $col_3, 'photo');
                    $row.append($col_3);
                }
                $form_group.append($row);
                $card_div.append($form_group);
                $("div.question-content:first").append($card_div);
                $("div.question-content:first").append('<hr>');
            } else if (question.name.indexOf("document") >= 0) {
                /* Document Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = '';
                $form_group.append($row);
                $row.append($col_9);
                Localizer.getString('document').then(function(result) {
                    content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">${result}</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $col_9.append(content);
                });

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    })
                    let req = ActionHelper.getAttachmentInfo(attachment_img);
                    let filesAmount = Object.keys(attachment).length;
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);

                    ActionHelper.setAttachmentPreview(req, question.name, filesAmount, $img_thumbnail, $col_3, 'document');
                    $row.append($col_3);
                }
                $form_group.append($row);
                $card_div.append($form_group);
                $("div.question-content:first").append($card_div);
                $("div.question-content:first").append('<hr>');
            } else if (question.name.indexOf("video") >= 0) {
                /* Video Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = '';
                $form_group.append($row);
                $row.append($col_9);
                Localizer.getString('video').then(function(result) {
                    content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">${result}</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $col_9.append(content);
                });

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    });
                    let req = ActionHelper.getAttachmentInfo(attachment_img);
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);
                    ActionHelper.setAttachmentPreview(req, question.name, 1, $img_thumbnail, $col_3, 'video');
                    $row.append($col_3);
                }

                $form_group.append($row);
                $card_div.append($form_group);
                $("div.question-content:first").append($card_div);
                $("div.question-content:first").append('<hr>');
            } else {
                if (question.options.length > 1) {
                    /* Question Section */
                    let $rowdDiv = $('<div class="row"></div>');
                    let $qDiv = $('<div class="col-sm-12"></div>');
                    let $dflex = $("<div class='d-table'></div>");

                    $card_div.append($rowdDiv);
                    $rowdDiv.append($qDiv);

                    let $questionHeading = $("<label class='mb0'></label>");
                    $questionHeading.append(
                        "<strong>" + count + ". " + question.displayName + "</strong>"
                    );

                    $card_div.append($dflex);
                    $dflex.append($questionHeading);

                    $dflex.append(
                        '<label class="float-right mb0" id="status-' + question.name + '"></label>'
                    );

                    question.options.forEach((option) => {
                        /* User Responded */
                        let userResponse = [];
                        let userResponseAnswer = "";

                        for (let i = 0; i < actionDataRowsLength; i++) {
                            if (actionDataRows[i].creatorId == userId) {
                                userResponse = actionDataRows[i].columnValues;
                                let userResponseLength = Object.keys(userResponse).length;

                                for (let j = 1; j <= userResponseLength; j++) {
                                    if (isJson(userResponse[j])) {
                                        let userResponseAns = JSON.parse(userResponse[j]);
                                        let userResponseAnsLen = userResponseAns.length;
                                        if (userResponseAnsLen > 1) {
                                            for (let k = 0; k < userResponseAnsLen; k++) {
                                                if (userResponseAns[k] == option.name) {
                                                    userResponseAnswer = userResponseAns[k];
                                                } else {
                                                    continue;
                                                }
                                            }
                                        } else {
                                            userResponseAnswer = userResponseAns;
                                        }
                                    } else {
                                        if (userResponse[j] == option.name) {
                                            userResponseAnswer = userResponse[j];
                                        }
                                    }
                                }
                            }
                        }

                        /* Correct Answer */
                        let correctResponse = JSON.parse(
                            actionInstance.customProperties[5].value
                        );
                        let correctResponseLength = Object.keys(correctResponse).length;
                        let correctAnswer = "";
                        for (let j = 0; j < correctResponseLength; j++) {

                            let correctResponseAns = correctResponse[j];
                            let correctResponseAnsLen = correctResponseAns.length;
                            for (let k = 0; k < correctResponseAnsLen; k++) {
                                if (correctResponseAns[k] == option.name) {
                                    correctAnswer = correctResponseAns[k];
                                }
                            }
                        }


                        if (question.options.length > 1) {
                            let $radioOption = getOptions(
                                option.displayName,
                                question.name,
                                option.name,
                                userResponseAnswer,
                                correctAnswer,
                            );
                            $card_div.append($radioOption);

                            $card_div.find("#status-" + question.name).html(`<span class="${answer_is == 'Correct' ? 'text-success' : 'text-danger'}">${answer_is}</span>`);
                        }
                    });

                    if (answer_is == "Correct") {
                        score++;
                    }
                    $("div.question-content:first").append($card_div);
                } else {
                    /* Text Section */
                    let $text_section = '';
                    Localizer.getString('text').then(function(result) {
                        $text_section = $(`<label class="mb0"><strong><span class="counter">${count}</span>. 
                                        <span class="training-type">${result}</span></strong></label>
                                        <span class="float-right result"></span>`);
                    });

                    let $clearfix = $(`<div class="clearfix"></div>`);
                    $form_group.append($hover_btn);
                    $hover_btn.append($text_section);
                    $form_group.append($clearfix);

                    let $description_section = `<p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $card_div.append($description_section);
                }
                $("div.question-content:first").append($card_div);
                $("div.question-content:first").append('<hr>');
            }
        });
        count++;
    });
    $("div.question-content:first").append('<div class="ht-100"></div>');
    total = count;

    let scorePercentage = Math.round((score / total) * 100);
    // $("#root > div:first").after(`<div class=""><h4><strong>Score: </strong>${scorePercentage}%</h4></div>`);
}

/*
 * Method to create options view
 * @param text string contains correct or incorrect text
 * @param name string
 * @param id string 
 * @param userResponse Array contains user responded answer for a question
 * @param correctAnswer Array contains correct answer of a question
 * @param is_text String for identify the response is question type or other
 */
function getOptions(text, name, id, userResponse, correctAnswer, is_text = '') {
    if (is_text == true) {
        // This is for text block 
        return true;
    }
    let $oDiv = $('<div class="form-group"></div>');

    /*  If answer is correct  and answered */
    if (userResponse == id && correctAnswer == id) {
        $oDiv.append(
            '<div class="form-group alert alert-success"><p class="mb0">' +
            text +
            ' <i class="fa  pull-right fa-check"></i> </p></div>'
        );
        if (answer_is == "") {
            Localizer.getString('correct').then(function(result) {
                answer_is = result;
            });
        }
    } else if (userResponse != id && correctAnswer == id) {
        /* If User Response is incorrect and not answered */
        $oDiv.append(
            '<div class="form-group alert alert-normal"><p class="mb0">' +
            text +
            ' <i class="fa fa-pull-right text-success fa-check"></p></div>'
        );
    } else if (userResponse == id && correctAnswer != id) {
        /* If User Response is incorrect and answered */
        $oDiv.append(
            '<div class="alert alert-danger"><p class="mb0">' +
            text +
            '<i class="fa fa-pull-right fa-close"></i></p></div>'
        );
        Localizer.getString('incorrect').then(function(result) {
            answer_is = result;
        });
    } else {
        $oDiv.append(
            '<div class="form-group alert alert-normal""><p class="mb0">' +
            text +
            "</p></div>"
        );
    }

    return $oDiv;
}

/*
 * Method to create footer
 * @param userId String identifier
 */
function footer(userId) {
    Localizer.getString('back').then(function(result) {
        $("div.question-content").append(
            '<div class="footer"><div class="footer-padd bt"><div class="container "><div class="row"><div class="col-9"><a class="cursur-pointer back1" userid-data="' +
            userId +
            '" id="hide2"><svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs"><path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z"></path><path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z"></path></svg> ' + result + '</a></div><div class="col-3"><button class="btn btn-tpt">&nbsp;</button></div></div></div></div></div>'
        );
    });
}

/*
 * Method to create footer
 */
function footer1() {
    Localizer.getString('back').then(function(result) {
        $("#root > div.card-box").append(
            '<div class="footer"><div class="footer-padd bt"><div class="container "><div class="row"><div class="col-9"><a class="cursur-pointer back" id="hide2"><svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs"><path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z"></path><path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z"></path></svg> ' + result + '</a></div><div class="col-3"><button class="btn btn-tpt">&nbsp;</button></div></div></div></div></div>'
        );
    });
}

/*
 * Event to click on back button and recreate landing page
 */
$(document).on("click", ".back", function() {
    createBody();
});

/*
 * Event to click on back button and back to responder and non responder tab page
 */
$(document).on("click", ".back1", function() {
    let userId = $(this).attr("userid-data");
    create_responder_nonresponders();
});

/*
 * Event to show responders and non responders page
 */
$(document).on("click", "#show-responders", function() {
    create_responder_nonresponders();
});

/*
 * Method to create responder and non-responder page
 */

function create_responder_nonresponders() {
    if (actionInstance.customProperties[2].value == "Only me") {
        if (actionContext.userId == actionInstance.creatorId) {
            $("#root").html("");
            if ($(".tabs-content:visible").length <= 0) {
                let $card1 = $('<div class="card-box card-bg card-border"></div>');
                let tabs = $(".tabs-content").clone();
                $card1.append(tabs.clone());
                $("#root").append($card1);
                footer1();
            }

            /*  Add Responders  */
            getResponders();

            /*  Add Non-reponders  */
            getNonresponders();
        } else {
            alert("Visible to sender only");
        }
    } else {
        $("#root").html("");
        if ($(".tabs-content:visible").length <= 0) {
            let $card1 = $('<div class="card-box card-bg card-border"></div>');
            let tabs = $(".tabs-content").clone();
            $card1.append(tabs.clone());
            $("#root").append($card1);
            footer1();
        }

        // Add Responders
        getResponders();

        // Add Non-reponders
        getNonresponders();
    }
}
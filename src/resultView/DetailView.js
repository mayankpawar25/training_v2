import * as actionSDK from "@microsoft/m365-action-sdk";
import { Localizer } from '../common/ActionSdkHelper';

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

let dueByKey = '';
let expiredOnKey = '';
let correctKey = '';
let incorrectKey = '';
let backKey = '';
let youKey = '';

let request = new actionSDK.GetContext.Request();
getTheme(request);

/* Async method for fetching localization strings */
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
    Localizer.getString('back').then(function(result) {
        backKey = result;
        $('.back-key').text(backKey);
    });

    Localizer.getString('you').then(function(result) {
        youKey = result;
    });
}

async function getTheme(request) {
    let response = await actionSDK.executeApi(request);
    let context = response.context;
    console.log("getContext response: ");
    console.log(JSON.stringify(context));
    $("form.section-1").show();
    let theme = context.theme;
    console.log(`theme: ${context.theme}`);
    $("link#theme").attr("href", "css/style-" + theme + ".css");
    await actionSDK.executeApi(new actionSDK.HideLoadingIndicator.Request());
}

let root = document.getElementById("root");

function OnPageLoad() {
    actionSDK
        .executeApi(new actionSDK.GetContext.Request())
        .then(function(response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            actionContext = response.context;
            getDataRows(response.context.actionId);
        })
        .catch(function(error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        });
}

function getDataRows(actionId) {
    let getActionRequest = new actionSDK.GetAction.Request(actionId);
    let getSummaryRequest = new actionSDK.GetActionDataRowsSummary.Request(
        actionId,
        true
    );
    let getDataRowsRequest = new actionSDK.GetActionDataRows.Request(actionId);
    let batchRequest = new actionSDK.BaseApi.BatchRequest([
        getActionRequest,
        getSummaryRequest,
        getDataRowsRequest,
    ]);

    actionSDK
        .executeBatchApi(batchRequest)
        .then(function(batchResponse) {
            console.info("BatchResponse: " + JSON.stringify(batchResponse));
            actionInstance = batchResponse.responses[0].action;
            actionSummary = batchResponse.responses[1].summary;
            actionDataRows = batchResponse.responses[2].dataRows;
            actionDataRowsLength = actionDataRows == null ? 0 : actionDataRows.length;
            createBody();
        })
        /* .catch(function (error) {
            console.log("Console log: Error: " + JSON.stringify(error));
        }) */
    ;
}

async function createBody() {
    let getSubscriptionCount = "";
    $("#root").html("");

    /*  Head Section  */
    head();

    /*  Person Responded X of Y Responses  */
    getSubscriptionCount = new actionSDK.GetSubscriptionMemberCount.Request(
        actionContext.subscription
    );
    let response = await actionSDK.executeApi(getSubscriptionCount);

    let $pcard = $('<div class="progress-section"></div>');

    let memberCount = response.memberCount;
    let participationPercentage = 0;

    participationPercentage = Math.round(
        (actionSummary.rowCreatorCount / memberCount) * 100
    );

    let xofy =
        actionSummary.rowCount + " of " + memberCount + " people responded";

    $pcard.append(
        "<label><strong>Participation " +
        participationPercentage +
        '% </strong></label><div class="progress mb-2"><div class="progress-bar bg-primary" role="progressbar" style="width: ' +
        participationPercentage +
        '%" aria-valuenow="' +
        participationPercentage +
        '" aria-valuemin="0" aria-valuemax="100"></div></div>'
    );
    $pcard.append(
        '<p class="date-color cursur-pointer md-0" id="show-responders">' +
        xofy +
        "</p>"
    );

    $("#root").append($pcard);

    await getUserprofile();

    // console.log("ResponderDate: " + JSON.stringify(ResponderDate));

    ResponderDate.forEach((responder) => {
        if (responder.value2 == myUserId) {
            createReponderQuestionView(myUserId, responder);
        }
    });

    return true;
}

function head() {
    let title = actionInstance.displayName;
    let description = actionInstance.customProperties[0]["value"];
    let dueby = new Date(actionInstance.expiryTime).toDateString();

    let $card = $('<div class=""></div>');
    let $title_sec = $("<h4>" + title + "</h4>");
    let $description_sec = $("<p class='text-justify'>" + description + "</p>");
    let $date_sec = $(
        '<p><small class="date-color md-0">' + "Due by " + dueby + "</small></p>"
    );

    $card.append($title_sec);
    $card.append($description_sec);
    $card.append($date_sec);
    $card.append("<hr>");

    $("#root").append($card);
}

async function getUserprofile() {
    let memberIds = [];
    ResponderDate = [];
    actionNonResponders = [];
    if (actionDataRowsLength > 0) {
        for (let i = 0; i < actionDataRowsLength; i++) {
            memberIds.push(actionDataRows[i].creatorId);
            console.log("memberIds" + JSON.stringify(memberIds));

            let requestResponders = new actionSDK.GetSubscriptionMembers.Request(
                actionContext.subscription, [actionDataRows[i].creatorId]
            ); // ids of responders

            let responseResponders = await actionSDK.executeApi(requestResponders);

            // console.log("requestResponders: " + JSON.stringify(requestResponders));
            // console.log("responseResponders: " + JSON.stringify(responseResponders));
            // return true;

            let perUserProfile = responseResponders.members;
            // console.log("perUserProfile: " + perUserProfile);
            ResponderDate.push({
                label: perUserProfile[0].displayName,
                value: new Date(actionDataRows[i].updateTime).toDateString(),
                value2: perUserProfile[0].id,
            });
        }
    }

    myUserId = actionContext.userId;
    // console.log(myUserId);
    let requestNonResponders = new actionSDK.GetActionSubscriptionNonParticipants.Request(
        actionContext.actionId,
        actionContext.subscription.id
    );
    let responseNonResponders = await actionSDK.executeApi(requestNonResponders);
    let tempresponse = responseNonResponders.nonParticipants;
    console.log(
        "responseNonResponders: " + JSON.stringify(responseNonResponders)
    );
    console.log("tempresponse: " + JSON.stringify(tempresponse));
    if (tempresponse != null) {
        for (let i = 0; i < tempresponse.length; i++) {
            actionNonResponders.push({
                label: tempresponse[i].displayName,
                value2: tempresponse[i].id,
            });
        }
    }
    console.log("actionNonResponders:" + JSON.stringify(actionNonResponders));
}

function getResponders() {
    $("table#responder-table tbody").html("");

    for (let itr = 0; itr < ResponderDate.length; itr++) {
        console.log('ResponderDate: ');
        console.log(ResponderDate);
        let id = ResponderDate[itr].value2;
        let name = "";
        if (ResponderDate[itr].value2 == myUserId) {
            name = youKey;
        } else {
            name = ResponderDate[itr].label;
        }
        var date = ResponderDate[itr].value;

        var matches = ResponderDate[itr].label.match(/\b(\w)/g); // [D,P,R]
        var initials = matches.join('').substring(0, 2); // DPR

        console.log('name: ');
        console.log(name);
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

function getNonresponders() {
    $("table#non-responder-table tbody").html("");

    for (let itr = 0; itr < actionNonResponders.length; itr++) {
        var id = actionNonResponders[itr].value2;
        var name = "";
        if (actionNonResponders[itr].value2 == myUserId) {
            name = "You";
        } else {
            name = actionNonResponders[itr].label;
        }
        var matches = actionNonResponders[itr].label.match(/\b(\w)/g); // [D,P,R]
        var initials = matches.join('').substring(0, 2); // DPR

        var date = actionNonResponders[itr].value;
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

$(document).on("click", ".getresult", function() {
    let userId = $(this).attr("id");
    console.log(userId);

    console.log("actionInstance: " + JSON.stringify(actionInstance));
    console.log("actionSummary: " + JSON.stringify(actionSummary));
    console.log("actionDataRows: " + JSON.stringify(actionDataRows));

    $("#root").html("");
    head();
    // let question_content = $('.question-content').clone();
    $("#root").append($(".question-content").clone());
    createQuestionView(userId);

    footer(userId);
});

function createReponderQuestionView(userId, responder) {
    $("div#root > div.question-content").html("");
    let count = 1;
    answer_is = "";
    total = 0;
    score = 0;

    var name = responder.label;
    console.log('Responder: ');
    console.log(responder);
    var matches = name.match(/\b(\w)/g); // [D,P,R]
    var initials = matches.join('').substring(0, 2); // DPR
    let $you_section = `<table class="table" cellspacing="0" id="responder-table">
                            <tbody>
                                <tr id="0:f5e55046-4ea4-46b8-a170-90883cc04fd5" class="getresult cursur-pointer">
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
        // let $linebreak = $("<br>");
        // $qDiv.append($linebreak);

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
                let content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">Photo</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                $form_group.append($row);
                $row.append($col_9);
                $col_9.append(content);

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    });

                    let req = new actionSDK.GetAttachmentInfo.Request(attachment_img);
                    let filesAmount = Object.keys(attachment).length;
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);
                    actionSDK.executeApi(req)
                        .then(function(response) {
                            console.info("Attachment - Response: " + JSON.stringify(response));
                            $img_thumbnail.append(`<img class="image-sec" id="${question.name}" src="${response.attachmentInfo.downloadUrl}"></img>`);
                            if (filesAmount > 1) {
                                $img_thumbnail.append(`<span class="file-counter"> +${filesAmount - 1} </span>`);
                            }
                            $col_3.append($img_thumbnail);
                        })
                        .catch(function(error) {
                            console.error("AttachmentAction - Error: " + JSON.stringify(error));
                        });

                    $row.append($col_3);
                }
                $form_group.append($row);
                $card_div.append($form_group);
                $("#root").append($card_div);
                $("#root").append('<hr>');
            } else if (question.name.indexOf("document") >= 0) {
                /* Document Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">Document</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                $form_group.append($row);
                $row.append($col_9);
                $col_9.append(content);

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    })
                    let req = new actionSDK.GetAttachmentInfo.Request(attachment_img);
                    let filesAmount = Object.keys(attachment).length;
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);
                    actionSDK.executeApi(req)
                        .then(function(response) {
                            console.info("Attachment - Response: " + JSON.stringify(response));
                            $img_thumbnail.append(`<img class="image-sec" id="${question.name}" src="images/doc.png"></img>`);
                            if (filesAmount > 1) {
                                $img_thumbnail.append(`<span class="file-counter"> +${filesAmount - 1} </span>`);
                            }
                            $col_3.append($img_thumbnail);
                        })
                        .catch(function(error) {
                            console.error("AttachmentAction - Error: " + JSON.stringify(error));
                        });
                    $row.append($col_3);
                }
                $form_group.append($row);
                $card_div.append($form_group);
                $("#root").append($card_div);
                $("#root").append('<hr>');
            } else if (question.name.indexOf("video") >= 0) {
                /* Video Section */
                let $col_9 = $(`<div class="col-9"></div>`);
                let content = `<label class="mb0"><strong><span class="counter">${count}</span>. 
                                    <span class="training-type">Document</span></strong> 
                                </label>
                                <span class="float-right result"></span>
                                <p class="mb0 text-description text-justify">${question.displayName}</p>`;
                $form_group.append($row);
                $row.append($col_9);
                $col_9.append(content);

                let dname = isJson(question.options[0].displayName) ? JSON.parse(question.options[0].displayName) : question.options[0].displayName;
                let attachment = isJson(dname.attachmentId) ? JSON.parse(dname.attachmentId) : dname.attachmentId;
                if (attachment != undefined) {
                    let attachment_img = '';
                    $.each(attachment, function(ind, att) {
                        attachment_img = att;
                        return false;
                    });
                    let req = new actionSDK.GetAttachmentInfo.Request(attachment_img);
                    let $col_3 = $(`<div class="col-3"></div>`);
                    let $img_thumbnail = $(`<div class="img-thumbnail"></div>`);
                    actionSDK.executeApi(req)
                        .then(function(response) {
                            console.info("Attachment - Response: " + JSON.stringify(response));
                            $img_thumbnail.append(`<div class="embed-responsive embed-responsive-4by3"><video controls="" class="video" id="${data.name}" src="${response.attachmentInfo.downloadUrl}"></video></div>`);
                            $col_3.append($img_thumbnail);
                        })
                        .catch(function(error) {
                            console.error("AttachmentAction - Error: " + JSON.stringify(error));
                        });
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

                    let $questionHeading = $("<label></label>");
                    $questionHeading.append(
                        "<strong>" + count + ". " + question.displayName + "</strong>"
                    );

                    $card_div.append($dflex);
                    $dflex.append($questionHeading);

                    $dflex.append(
                        '<label class="float-right" id="status-' + question.name + '"></label>'
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
                                    // console.log('isJson(userResponse[' + j + '])' + isJson(userResponse[j]));
                                    if (isJson(userResponse[j])) {
                                        let userResponseAns = JSON.parse(userResponse[j]);
                                        let userResponseAnsLen = userResponseAns.length;
                                        // console.log('userResponseAns: ' + JSON.stringify(userResponseAns));
                                        // console.log('userResponseAnsLen: ' + userResponseAnsLen);
                                        if (userResponseAnsLen > 1) {
                                            console.log("here if block");
                                            for (let k = 0; k < userResponseAnsLen; k++) {
                                                console.log("userResponseAns[k]" + userResponseAns[k]);
                                                if (userResponseAns[k] == option.name) {
                                                    userResponseAnswer = userResponseAns[k];
                                                    // console.log('if userResponseAnswer' + k + ': ' + JSON.stringify(userResponseAnswer));
                                                } else {
                                                    continue;
                                                }
                                            }
                                        } else {
                                            userResponseAnswer = userResponseAns;
                                            // console.log('userResponseAnswer: ' + userResponseAnswer);
                                        }
                                    } else {
                                        console.log(
                                            "Else: userResponseAns - " + JSON.stringify(userResponse)
                                        );
                                        if (userResponse[j] == option.name) {
                                            userResponseAnswer = userResponse[j];
                                            // console.log('userResponseAnswer: ' + userResponseAnswer);
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
                            console.log("correctResponse: " + JSON.stringify(correctResponse[j]));

                            let correctResponseAns = correctResponse[j];
                            console.log(
                                "correctResponseAns: " + JSON.stringify(correctResponseAns)
                            );
                            let correctResponseAnsLen = correctResponseAns.length;
                            for (let k = 0; k < correctResponseAnsLen; k++) {
                                if (correctResponseAns[k] == option.name) {
                                    console.log("correctAnswer: " + JSON.stringify(correctAnswer));
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
                            console.log($radioOption);
                            $card_div.append($radioOption);

                            $card_div.find("#status-" + question.name).html(`<span class="${answer_is == 'Correct' ? 'text-success' : 'text-danger'}">${answer_is}</span>`);
                        }
                    });

                    if (answer_is == "Correct") {
                        score++;
                    }
                    $("#root").append($card_div);
                    // $("#root").append('<hr>');
                } else {
                    /* Text Section */
                    let $text_section = $(`<label class="mb0"><strong><span class="counter">${count}</span>. 
                                        <span class="training-type">Text</span></strong></label>
                                        <span class="float-right result"></span>`);

                    let $clearfix = $(`<div class="clearfix"></div>`);
                    $form_group.append($hover_btn);
                    $hover_btn.append($text_section);
                    $form_group.append($clearfix);

                    let $description_section = `<p class="mb0 text-description text-justify">${question.displayName}</p>`;
                    $card_div.append($description_section);
                    // $card_div.after('<hr>');
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

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function createQuestionView(userId) {
    total = 0;
    score = 0;
    $("div#root > div.question-content").html("");
    let count = 1;
    // console.log(JSON.stringify(actionInstance));
    actionInstance.dataTables.forEach((dataTable) => {
        // let $linebreak = $("<br>");
        // $qDiv.append($linebreak);

        dataTable.dataColumns.forEach((question, ind) => {
            answer_is = "";

            let $cardDiv = $('<div class="card-box card-bg card-border"></div>');
            let $rowdDiv = $('<div class="row"></div>');
            let $qDiv = $('<div class="col-sm-12"></div>');
            let $dflex = $("<div class='d-table'></div>");

            $cardDiv.append($rowdDiv);
            $rowdDiv.append($qDiv);

            let count = ind + 1;
            let $questionHeading = $("<label></label>");
            $questionHeading.append(
                "<strong>" + count + ". " + question.displayName + "</strong>"
            );

            $cardDiv.append($dflex);
            $dflex.append($questionHeading);

            $dflex.append(
                '<label class="float-right" id="status-' + question.name + '"></label>'
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
                            // console.log('isJson(userResponse[' + j + '])' + isJson(userResponse[j]));
                            if (isJson(userResponse[j])) {
                                let userResponseAns = JSON.parse(userResponse[j]);
                                let userResponseAnsLen = userResponseAns.length;
                                // console.log('userResponseAns: ' + JSON.stringify(userResponseAns));
                                // console.log('userResponseAnsLen: ' + userResponseAnsLen);
                                if (userResponseAnsLen > 1) {
                                    console.log("here if block");
                                    for (let k = 0; k < userResponseAnsLen; k++) {
                                        console.log("userResponseAns[k]" + userResponseAns[k]);
                                        if (userResponseAns[k] == option.name) {
                                            userResponseAnswer = userResponseAns[k];
                                            // console.log('if userResponseAnswer' + k + ': ' + JSON.stringify(userResponseAnswer));
                                        } else {
                                            continue;
                                        }
                                    }
                                } else {
                                    userResponseAnswer = userResponseAns;
                                    // console.log('userResponseAnswer: ' + userResponseAnswer);
                                }
                            } else {
                                console.log(
                                    "Else: userResponseAns - " + JSON.stringify(userResponse)
                                );
                                if (userResponse[j] == option.name) {
                                    userResponseAnswer = userResponse[j];
                                    // console.log('userResponseAnswer: ' + userResponseAnswer);
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
                    console.log("correctResponse: " + JSON.stringify(correctResponse[j]));

                    let correctResponseAns = correctResponse[j];
                    console.log(
                        "correctResponseAns: " + JSON.stringify(correctResponseAns)
                    );
                    let correctResponseAnsLen = correctResponseAns.length;
                    for (let k = 0; k < correctResponseAnsLen; k++) {
                        if (correctResponseAns[k] == option.name) {
                            console.log("correctAnswer: " + JSON.stringify(correctAnswer));
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
                        correctAnswer
                    );
                    console.log($radioOption);
                    $cardDiv.append($radioOption);

                    $cardDiv.find("#status-" + question.name).html(`<span class="${answer_is == 'Correct' ? 'text-success' : 'text-danger'}">${answer_is}</span>`);
                }
            });

            if (answer_is == "Correct") {
                score++;
            }
            $("div.question-content:first").append($cardDiv);
        });
        count++;
    });
    $("div.question-content:first").append('<div class="ht-100"></div>');
    total = count;

    console.log(`${score} / ${total}`);
    let scorePercentage = Math.round((score / total) * 100);

    // $("#root > div:first").after(`<div class=""><h4><strong>Score: </strong>${scorePercentage}%</h4></div>`);
}

function getOptions(text, name, id, userResponse, correctAnswer, is_text = '') {
    if (is_text == true) {
        // This is for text block 
        return true;
    }
    console.log(
        text + ", " + name + ", " + id + ", " + userResponse + ", " + correctAnswer
    );
    let $oDiv = $('<div class="form-group"></div>');

    /*  If answer is correct  and answered */
    if (userResponse == id && correctAnswer == id) {
        $oDiv.append(
            '<div class="form-group alert alert-success"><p class="mb0">' +
            text +
            ' <i class="fa  pull-right fa-check"></i> </p></div>'
        );
        if (answer_is == "") {
            answer_is = "Correct";
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
        answer_is = "Incorrect";
    } else {
        $oDiv.append(
            '<div class="form-group alert alert-normal""><p class="mb0">' +
            text +
            "</p></div>"
        );
    }

    return $oDiv;
}

function footer(userId) {
    $("div.question-content").append(
        '<div class="footer"><div class="footer-padd bt"><div class="container "><div class="row"><div class="col-9"><a class="cursur-pointer back1" userid-data="' +
        userId +
        '" id="hide2"><svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs"><path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z"></path><path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z"></path></svg> Back</a></div><div class="col-3"><button class="btn btn-tpt">&nbsp;</button></div></div></div></div></div>'
    );
}

function footer1() {
    $("#root > div.card-box").append(
        '<div class="footer"><div class="footer-padd bt"><div class="container "><div class="row"><div class="col-9"><a class="cursur-pointer back" id="hide2"><svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs"><path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z"></path><path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z"></path></svg> Back</a></div><div class="col-3"><button class="btn btn-tpt">&nbsp;</button></div></div></div></div></div>'
    );
}

$(document).on("click", ".back", function() {
    createBody();
});

$(document).on("click", ".back1", function() {
    let userId = $(this).attr("userid-data");
    create_responder_nonresponders();
});

$(document).on("click", "#show-responders", function() {
    create_responder_nonresponders();
});

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
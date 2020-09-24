import * as actionSDK from "@microsoft/m365-action-sdk";

// ActionSDK.APIs.actionViewDidLoad(true /*success*/ );

// Fetching HTML Elements in Variables by ID.
var $root = "";
let row = {};
let actionInstance = null;
let summary_answer_resp = [];

async function getTheme(request) {
    let response = await actionSDK.executeApi(request);
    let context = response.context;
    console.log("getContext response: ");
    console.log(JSON.stringify(context));
    $("form.section-1").show();
    var theme = context.theme;
    console.log(`theme: ${context.theme}`)
    $("link#theme").attr("href", "css/style-" + theme + ".css");

    $('div.section-1').append(`<div class="row"><div class="col-12"><div id="root"></div></div></div>`);
    $('div.section-1').after(modal_section);
    // $('div.section-1').after(footer_section);
    $root = $("#root")

    setTimeout(() => {
        $('div.section-1').show();
        $('div.footer').show();
    }, 1000);
    await actionSDK.executeApi(new actionSDK.HideLoadingIndicator.Request());

    OnPageLoad();
}

// *********************************************** HTML ELEMENT***********************************************
$(document).ready(function() {
    let request = new actionSDK.GetContext.Request();
    getTheme(request);
});

function OnPageLoad() {
    actionSDK
        .executeApi(new actionSDK.GetContext.Request())
        .then(function(response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
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

    /*  Check Expiry date time  */
    var current_time = new Date().getTime();
    if (actionInstance.expiryTime <= current_time) {
        var $card = $('<div class="card"></div>');
        var $spDiv = $('<div class="col-sm-12"></div>');
        var $sDiv = $('<div class="form-group">Quiz Expired...</div>');
        $card.append($spDiv);
        $spDiv.append($sDiv);
        $root.append($card);
    } else {

        $('div.section-1').show();
        $('div.section-1').append(head_section1);
        $('#section1-training-title').html(actionInstance.displayName);
        $('#section1-training-description').html(actionInstance.customProperties[0].value);

        /* Create Text and Question summary */
        actionInstance.dataTables.forEach((dataTable) => {
            dataTable.dataColumns.forEach((data, ind) => {
                if (data.valueType == 'LargeText') {
                    /* Call Text Section 1 */
                    var counter = $('div.card-box').length;
                    var text_title = data.displayName.length > 100 ? data.displayName.substr(0, data.displayName.lastIndexOf(' ', 97)) + '...' : data.displayName;
                    $('div.section-1').append(text_section1);
                    $('div.card-box:last').find('span.counter').text(counter);
                    $('div.card-box:last').find('.text-description').text(text_title);

                } else if (data.valueType == 'SingleOption' || data.valueType == 'MultiOption') {
                    /* Call Question Section 1 */
                    var counter = $('div.card-box').length;
                    var text_title = data.displayName.length > 100 ? data.displayName.substr(0, data.displayName.lastIndexOf(' ', 97)) + '...' : data.displayName;
                    $('div.section-1').append(question_section1);
                    $('div.card-box:last').find('span.counter').text(counter);
                    $('div.card-box:last').find('.question-title').text(`Question with ${numbertowords(Object.keys(data.options).length)} options`);
                    $('div.card-box:last').find('.question-title-main').text(text_title);
                }
            });
        });


        $('div.section-1').append(`<div class="container pb-100"></div>`);
        $('div.section-1').after(footer_section1);

        /* var $card = $('<div class=""></div>');
        var $title = $("<h4>" + actionInstance.displayName + "</h4>");
        var $hr = $("<hr>");
        var $description = $('<p class="">' + actionInstance.customProperties[0].value + '</p>');
        console.log(actionInstance);
        $card.append($title);
        $card.append($description);
        $root.append($card);
        createQuestionView();
        $root.append($hr); */
        return;
    }
}

$(document).on('click', '.submit-form', function() {
    submitForm();
})

function createQuestionView(index_num) {
    var count = 1;
    actionInstance.dataTables.forEach((dataTable) => {
        dataTable.dataColumns.forEach((question, ind) => {

            if (ind == index_num) {
                var count = ind + 1;
                var $card = $('<div class="card-box card-border card-bg"></div>');

                var $questionHeading = `<div class="form-group">
                    <div class="hover-btn ">
                        <label><strong><span class="counter">${count}</span>. <span class="training-type">Question</span></strong> </label>
                    </div>
                    <div class="clearfix"></div>
                    <hr>
                </div>
                <label><strong>${question.displayName}</strong></label>`;

                $card.append($questionHeading);
                var choice_occurance = 0;
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
                        var $radioOption = getCheckboxButton(
                            option.displayName,
                            question.name,
                            option.name
                        );
                        $card.append($radioOption);
                    });
                } else {
                    //add checkbox button
                    question.options.forEach((option) => {
                        var $radioOption = getRadioButton(
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
}

function getRadioButton(text, name, id) {
    var $div_data = $(`<div class="form-group radio-section custom-radio-outer" id="${id}" columnId="${name}" ><label class="custom-radio"><input type="radio" name="${name}" id="${id}"> <span class="radio-block"></span> ${text}</label></div>`)
    return $div_data;
}

function getCheckboxButton(text, name, id) {
    /* var $oDiv = $('<div class="form-group radio-section custom-check-outer" id="' + id + '" columnId="' + name + '" ></div>');
    var $soDiv = $('<label class="custom-check form-check-label"></label>');
    var radiobox = '<input type="checkbox" class="form-check-input" name="' + name + '" id="' + id + '">';
    var $lDiv = $(radiobox + ' <span class="checkmark"></span>' + text);
    $oDiv.append($soDiv);
    $soDiv.append($lDiv);
    return $oDiv; */
    var div_data = $(`<div class="form-group radio-section custom-check-outer" id="${id}" columnId="${name}" ><label class="custom-check form-check-label"><input type="checkbox" class="form-check-input" name="${name}" id="${id}"><span class="checkmark"></span> ${text}</label></div>`)
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
                    var counter = $('.section-3 div.card-box').length;
                    var text_title = data.displayName.length > 100 ? data.displayName.substr(0, data.displayName.lastIndexOf(' ', 97)) + '...' : data.displayName;
                    $('div.section-3 .container:first').append(text_section1);
                    $('div.card-box:last').find('span.counter').text(counter);
                    $('div.card-box:last').find('.text-description').text(text_title);
                } else if (data.valueType == 'SingleOption' || data.valueType == 'MultiOption') {
                    /* Call Question Section 1 */
                    var counter = $('.section-3 div.card-box').length;
                    var text_title = data.displayName.length > 100 ? data.displayName.substr(0, data.displayName.lastIndexOf(' ', 97)) + '...' : data.displayName;
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
    var data = [];
    row = {};
    $.each($("input[type='checkbox']:checked"), function(ind, v) {
        var col = $(this).parents("div.form-group").attr("columnid");
        data.push($(this).attr("id"));

        if (!row[col]) row[col] = [];
        row[col] = JSON.stringify(data);

        $('#next').prop('disabled', false);
    });

    $.each($("input[type='radio']:checked"), function() {
        var col = $(this).parents("div.form-group").attr("columnid");

        if (!row[col]) row[col] = [];
        row[col] = $(this).attr("id");

        $('#next').prop('disabled', false);

    });


    // console.log(row);
} */

function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function getDataRow(actionId) {
    var data = {
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
    var addDataRowRequest = new actionSDK.AddActionDataRow.Request(
        getDataRow(actionId)
    );
    var closeViewRequest = new actionSDK.CloseView.Request();
    var batchRequest = new actionSDK.BaseApi.BatchRequest([
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
            var y = Object.keys(dataTable.dataColumns).length;
            $('#y').text(y);

            dataTable.dataColumns.forEach((data, ind) => {
                if (ind == index_num) {
                    var x = ind + 1;
                    $('#x').text(x);

                    if (data.valueType == 'LargeText') {
                        /* Call Text Section 1 */
                        $('div.section-2 > .container:first').append(text_section2);
                        var counter = $('div.section-2 .container > div.card-box').length;
                        var text_title = data.displayName;
                        $('div.section-2 > .container:first > div.card-box:last').find('span.counter').text(counter);
                        $('div.section-2 > .container:first > div.card-box:last').find('.text-description').text(text_title);
                        console.log(`counter tet ${counter}`);

                    } else if (data.valueType == 'SingleOption' || data.valueType == 'MultiOption') {
                        createQuestionView(index_num);
                        var counter = $('div.section-2 .container > div.card-box').length;
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

$(document).on('click', '#next', function() {
    var data = [];

    /* Validate */
    if ($('div.card-box:visible').find('.training-type').text() == 'Question') {
        /* Question Validations */
        var selected_answer = [];
        var check_counter = 0;
        var correct_answer = false;
        var attr_name = '';

        var is_checked = false;

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
        var answerKeys = JSON.parse(actionInstance.customProperties[4].value);
        var correct_ans_arr = [];

        $.each(selected_answer, function(i, selected_subarray) {
            console.log(answerKeys.toString());
            if ($.inArray(selected_subarray, answerKeys[(attr_name - 1)]) !== -1) {
                correct_answer = true;
            }
        });

        summary_answer_resp.push(correct_answer)

        /* console.log(attr_name - 1);
        console.log(answerKeys[(attr_name - 1)].toString()); */
        $.each(answerKeys[(attr_name - 1)], function(ii, subarr) {
            correct_ans_arr.push($.trim($('#' + subarr).text()));
        });



        var correct_value = correct_ans_arr.join();
        if (is_checked == true) {
            pagination++;
            if (correct_answer == true) {
                if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").attr('disabled') !== "disabled") {
                    $('#exampleModalCenter').find('#exampleModalLongTitle').html('<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="gt gs mt--4"><g><g><g><path d="M507.113,428.415L287.215,47.541c-6.515-11.285-18.184-18.022-31.215-18.022c-13.031,0-24.7,6.737-31.215,18.022L4.887,428.415c-6.516,11.285-6.516,24.76,0,36.044c6.515,11.285,18.184,18.022,31.215,18.022h439.796c13.031,0,24.7-6.737,31.215-18.022C513.629,453.175,513.629,439.7,507.113,428.415z M481.101,449.441c-0.647,1.122-2.186,3.004-5.202,3.004H36.102c-3.018,0-4.556-1.881-5.202-3.004c-0.647-1.121-1.509-3.394,0-6.007L250.797,62.559c1.509-2.613,3.907-3.004,5.202-3.004c1.296,0,3.694,0.39,5.202,3.004L481.1,443.434C482.61,446.047,481.748,448.32,481.101,449.441z"/><rect x="240.987" y="166.095" width="30.037" height="160.197" /><circle cx="256.005" cy="376.354" r="20.025" /></g></g></g > <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg > Answer response!');
                    $('#exampleModalCenter').find('.modal-body').html(`<label class="text-success"><i class="fa fa-check" aria-hidden="true"></i> <strong>Correct</strong></label><p><label>Your Answer</label><br>${correct_value}</p>`);
                    $('#exampleModalCenter').find('.modal-footer').html('<button type="button" class="btn btn-primary btn-sm" data-dismiss="modal">Continue</button>');
                    $('#exampleModalCenter').find('#save-changes').hide();
                    $('#exampleModalCenter').modal('show');

                    $("#exampleModalCenter").on("hidden.bs.modal", function() {
                        // put your default event here
                        // addDataRows(response.context.actionId);
                        $('div.card-box:visible').find("input").each(function(ind, ele) {
                            $(ele).prop('disabled', true);
                        });

                        var limit = $('#y').text();
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
                            }
                            $('#x').text((pagination + 1));

                        } else {
                            /* Show Summary */
                            // $('#next').prop('disabled', true);
                        }
                    });
                } else {
                    var limit = $('#y').text();
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
                        }
                        $('#x').text((pagination + 1));
                    } else {
                        /* Show Summary */
                        $('#next').prop('disabled', true);
                    }
                }
            } else {
                if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("input").attr('disabled') !== "disabled") {

                    $('#exampleModalCenter').find('#exampleModalLongTitle').html('<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="gt gs mt--4"><g><g><g><path d="M507.113,428.415L287.215,47.541c-6.515-11.285-18.184-18.022-31.215-18.022c-13.031,0-24.7,6.737-31.215,18.022L4.887,428.415c-6.516,11.285-6.516,24.76,0,36.044c6.515,11.285,18.184,18.022,31.215,18.022h439.796c13.031,0,24.7-6.737,31.215-18.022C513.629,453.175,513.629,439.7,507.113,428.415z M481.101,449.441c-0.647,1.122-2.186,3.004-5.202,3.004H36.102c-3.018,0-4.556-1.881-5.202-3.004c-0.647-1.121-1.509-3.394,0-6.007L250.797,62.559c1.509-2.613,3.907-3.004,5.202-3.004c1.296,0,3.694,0.39,5.202,3.004L481.1,443.434C482.61,446.047,481.748,448.32,481.101,449.441z"/><rect x="240.987" y="166.095" width="30.037" height="160.197" /><circle cx="256.005" cy="376.354" r="20.025" /></g></g></g > <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg > Answer response!');
                    $('#exampleModalCenter').find('.modal-body').html(`<label class="text-danger"><i class="fa fa-remove" aria-hidden="true"></i> <strong>Incorrect</strong></label><p><label>Correct Answer</label><br>${correct_value}</p>`);
                    $('#exampleModalCenter').find('.modal-footer').html('<button type="button" class="btn btn-primary btn-sm" data-dismiss="modal">Continue</button>');
                    $('#exampleModalCenter').find('#save-changes').hide();
                    $('#exampleModalCenter').modal('show');

                    $("#exampleModalCenter").on("hidden.bs.modal", function() {
                        // put your default event here
                        $('div.card-box:visible').find("input").each(function(ind, ele) {
                            $(ele).prop('disabled', true);
                        });
                        var limit = $('#y').text();
                        console.log(`${pagination} < ${limit}`);

                        if ((pagination) < limit) {
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
                            }
                            $('#x').text((pagination + 1));

                            summary_answer_resp.push(true);

                        } else {
                            /* Show Summary */
                            // $('#next').prop('disabled', true);
                        }
                    });
                } else {
                    var limit = $('#y').text();
                    console.log(`${pagination} < ${limit}`);

                    if ((pagination) < limit) {
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
                        }
                        $('#x').text((pagination + 1));

                        summary_answer_resp.push(true);

                    } else {
                        /* Show Summary */
                        $('#next').prop('disabled', true);
                        loadSummaryView();
                    }
                }

            }
        } else {
            $('#exampleModalCenter').find('#exampleModalLongTitle').html('<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="gt gs mt--4"><g><g><g><path d="M507.113,428.415L287.215,47.541c-6.515-11.285-18.184-18.022-31.215-18.022c-13.031,0-24.7,6.737-31.215,18.022L4.887,428.415c-6.516,11.285-6.516,24.76,0,36.044c6.515,11.285,18.184,18.022,31.215,18.022h439.796c13.031,0,24.7-6.737,31.215-18.022C513.629,453.175,513.629,439.7,507.113,428.415z M481.101,449.441c-0.647,1.122-2.186,3.004-5.202,3.004H36.102c-3.018,0-4.556-1.881-5.202-3.004c-0.647-1.121-1.509-3.394,0-6.007L250.797,62.559c1.509-2.613,3.907-3.004,5.202-3.004c1.296,0,3.694,0.39,5.202,3.004L481.1,443.434C482.61,446.047,481.748,448.32,481.101,449.441z"/><rect x="240.987" y="166.095" width="30.037" height="160.197" /><circle cx="256.005" cy="376.354" r="20.025" /></g></g></g > <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg > Note!');
            $('#exampleModalCenter').find('.modal-body').html(`<label>Please choose any choice<label>`);
            $('#exampleModalCenter').find('.modal-footer').html('<button type="button" class="btn btn-primary btn-sm" data-dismiss="modal">Continue</button>');
            $('#exampleModalCenter').find('#save-changes').hide();
            $('#exampleModalCenter').modal('show');

            $("#exampleModalCenter").on("hidden.bs.modal", function() {
                $('#next').attr('disabled', false);
                // $('.card-box.card-border.card-bg:visible').find('input').prop('disabled', false);
            });
        }

        if ((pagination + 1) >= limit) {
            loadSummaryView();
        }
    } else {
        pagination++;
        var limit = $('#y').text();
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
            }
            $('#x').text((pagination + 1));
        } else {
            /* Show Summary */
            $('#next').prop('disabled', true);
        }
        if (pagination >= limit) {
            loadSummaryView();
        }
    }
});

$(document).on('click', '#back', function() {
    console.log(`${pagination} <= 1`)
    if (pagination < 1) {
        $('#back').prop('disabled', true);
    } else {
        $('#back').prop('disabled', false);
        $('#next').prop('disabled', false);

        $('div.section-2 > .container:first > div.card-box:nth-child(' + (pagination + 1) + ')').hide();
        $('div.section-2 > .container:first > div.card-box:nth-child(' + pagination + ')').show();

        $('#x').text(pagination);
        pagination--;
    }
});
// *********************************************** OTHER ACTION END***********************************************

var footer_section = `<div class="footer" style="display:none;">
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

var head_section1 = `<div class="card-box card-bg card-border">
                            <h4 id="section1-training-title">My Training title</h4>
                            <p class="mb0" id="section1-training-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                                specimen book.</p>
                        </div>`;

var text_section1 = `<div class="card-box card-bg card-border">
                        <div class="form-group">
                            <div class="hover-btn ">
                                <label><strong><span class="counter">1</span>. <span class="training-type">Text</span></strong> </label><span class="float-right result"></span>
                            </div>
                            <div class="clearfix"></div>
                            <hr>
                        </div>
                        <p class="mb0 text-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                            specimen book.</p>
                    </div>`;

var question_section1 = `<div class="card-box card-bg card-border">
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

var footer_section1 = `<div class="footer section-1-footer">
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

var text_section2 = `<div class="card-box card-bg card-border">
                        <div class="form-group">
                            <div class="hover-btn ">
                                <label><strong><span class="counter">1</span>. Text</strong> </label>
                                <button type="button" class="close remove-question" data-dismiss="alert">
                                    <span aria-hidden="true">
                                        
                                    </span>
                                    <span class="sr-only">Close</span>
                                </button>
                            </div>
                            <div class="clearfix"></div>
                            <hr>
                        </div>
                        <p class="mb0 text-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                            specimen book.</p>
                    </div>`;
var question_section2 = ``;
var footer_section2 = `<div class="footer section-2-footer">
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

var footer_section3 = `<div class="footer section-3-footer">
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
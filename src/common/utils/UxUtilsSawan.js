// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Constants } from "./Constants";

export class UxUtils {
    /* Creation View */
    static getLandingContainer(uploadCoverImageKey, trainingTitleKey, trainingDescriptionOptionalKey, coverImageKey, clearKey, settingText, nextKey) {
        return `<div class="section-1" style="display:none">
            <div class="container">
                <div id="root" class="">
                    <div class="form-group mb--16">
                        <input type="Text" placeholder="${trainingTitleKey}" class="in-t input-title form-control training-title-key" id="training-title" />
                    </div>
                    <div class="form-group mb--16">
                        <textarea placeholder="${trainingDescriptionOptionalKey}" class="font-12 in-t form-control training-description-optional-key" id="training-description"></textarea>
                    </div>
                    <div class="form-group mb0">
                        <label class="pull-left cover-image-label font-12 semi-bold mb--8 app-black-color ">${coverImageKey}</label>
                        <label class="quiz-clear font-12 semi-bold mb--8 cursor-pointer pull-right theme-color training-clear clear-key" style="display:none" tabindex="0" role="input">${clearKey}</label>
                        <div class="clearfix"></div>
                        <div class="relative" tabindex="0" role="image">

                            <div class="loader-cover cover-image-loader" style="display: none;">
                                <div class="d-table-cell">
                                    <div class="spinner-border" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </div>

                            <!-- hide this div after img added -->
                            <div class="photo-box card card-bg card-border max-min-220 upvj cursor-pointer" >
                                <span class="tap-upload-label upload-cover-image-key">${uploadCoverImageKey}</span>
                            </div>
                            <!-- show this div after img added -->
                            <div class="training-updated-img quiz-updated-img max-min-220 card-bg card-border updated-img bdr-none bg-none fixed-ar fixed-ar-16-9 relative" style="display:none">
                                <img src="" id="training-img-preview" class=" training-updated-img quiz-updated-img card-bg card-border heightfit" >
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
                        <div class="col-9 d-table">
                            <div class="d-table-cell">
                                <a class="theme-color cursor-pointer show-setting" id="hide1">
                                    <span class="cursor-pointer" tabindex="0" role="button" data-id="hide1">
                                        ${Constants.getCogIcon()}
                                        <span id="due"> ${settingText}</span>
                                    </span>
                                </a>
                            </div>
                        </div>
                        <div class="col-3 text-right"><button type="button" class="btn btn-primary btn-sm pull-right next-key" id="next1" tabindex="0" role="button" data-id="next1"> ${nextKey}</button></div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getTrainingContentArea(backKey, submitKey, addContentKey) {
        return `<div class="section-2" style="display:none">
            <div class="container">
                <div id="root" class="">
                    <div class="training-card-section">
                        <div class="quiz-updated-img max-min-220 bdr-none bg-none cover-img cursor-pointer mb--16">
                            <img src="" id="training-title-image" style="" class="quiz-updated-img card-bg card-border" style="display:none;">
                            <input type="file" name="quiz_image" class="in-t form-control d-none" id="cover-image" accept="image/*" src="images/px-img.png">
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <h4 class="mb--8 text-break" id="training-title-content"></h4>
                                <p class="text-justify font-12 text-break mb--16" id="training-description-content"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-12 content-menu">
                        <div class="dropdown">
                            <button type="button" class="btn btn-primary btn-sm dropdown-toggle dd-btn" id="add-content" data-toggle="dropdown"  tabindex="0" role="button" data-id="add-content">
                                <span class="span1 add-content-label">
                                    ${addContentKey}
                                </span>
                                <span class="span2">
                                    ${Constants.getDownCaratIcon()}
                                </span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="cursur-pointer" tabindex="0" role="button" data-id="add-text" id="add-text">${Constants.getTextIcon()} <span class="text-label">Text</span></a>
                                <a class="cursur-pointer" tabindex="0" role="button" data-id="add-photo" id="add-photo">${Constants.getImageIcon()} <span class="photo-label">Image</span></a>
                                <a class="cursur-pointer" tabindex="0" role="button" data-id="add-document" id="add-document">${Constants.getDocumentIcon()} <span class="document-label">Document</span></a>
                                <a class="cursur-pointer" tabindex="0" role="button" data-id="add-video" id="add-video">${Constants.getVideoIcon()} <span class="video-label">Video</span></a>
                                <a class="cursur-pointer" tabindex="0" role="button" data-id="add-questions" id="add-questions">${Constants.getQuestionIcon()} <span class="quiz-label">Quiz</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer section-2-footer" style="display:none">
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="">
                        <div class="row">
                            <div class="col-9">
                                <div class="d-table">
                                    <a>
                                        <span tabindex="0" role="button" data-id="back" class="cursor-pointer" id="back">
                                            ${Constants.getRightCaratIcon()} <span class="back-key">${backKey}</span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div class="col-3 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right submit-key" id="submit" tabindex="0" role="button" data-id="submit"> ${submitKey}</button></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getQuestionArea(questionKey, questionTitleKey, checkMeKey) {
        return `<div class="question-section">
            <div class="container question-container" id="question1">
                <div class="card-box card-border card-bg">
                    <div class="form-group-question">
                        <div>
                            <span class="question-number font-12 bold input-group-text mb--8 input-tpt pl-0 strong cursor-pointer">${UxUtils.getQuestionNumber(questionKey, 1)}</span>
                            <span class="input-group-text remove-question remove-option-q input-tpt cursor-pointer" aria-hidden="true" >
                                ${Constants.getTrashIcon()}
                            </span>
                        </div>
                        <div class="question-preview min-max-132 updated-img" style="display:none">
                            <img src="" class="question-preview-image" style="display:none" />
                        </div>
                        <div class="input-group mb--16 input-group-tpt-q">
                            <div class="input-group-append cursor-pointer">
                                ${Constants.getUploadQuestionImageIcon()}
                                <input type="file" name="question_image" class="d-none" accept="image/*" id="question-image-1"/>
                            </div>
                            <input type="text" class="form-control in-t pl--32" placeholder="Type your question" aria-label="${questionTitleKey}" aria-describedby="basic-addon2" id="question-title" maxlength="5000">
                        </div>
                    </div>
                    <div class="d-flex-ques">
                        <div class="ext-flex"></div>
                        <div class="form-group-opt mb--8" id="options">
                            <div class="choice-outer">
                                <div class="option-div">
                                    <div class="row">
                                        <div class="col-12 radio-outer">
                                            <div class="option-preview min-max-132 updated-img" style="display:none">
                                                <img src="" class="option-preview-image" style="display:none" />
                                            </div>
                                            <div class="input-group input-group-tpt mb--8 ">
                                                <div class="input-group-append left cursor-pointer">
                                                    ${Constants.getUploadOptionImageIcon()}
                                                    <input type="file" name="option_image" class="d-none" accept="image/*" id="option-image-1"/>
                                                </div>
                                                <input type="text" class="form-control in-t opt-cls pl--32" placeholder="Enter your choice" aria-label="Option 1" aria-describedby="basic-addon2" id="option1" maxlength="1000" >
                                                <div class="input-group-append  input-tpt trash-ic cursor-pointer remove-option-href" tabindex="0" role="checkbox">
                                                    <span class="remove-option">
                                                        ${Constants.getTrashIcon()}
                                                    </span>
                                                </div>
                                                <div class="input-group-append check-opt check-me-title"  title="${checkMeKey}" tabindex="0" role="checkbox">
                                                    <span class="input-group-text input-tpt cursor-pointer">
                                                        ${Constants.getDefaultTickIcon()}
                                                    </span>
                                                </div>
                                                <div class="text-right text-success">
                                                    <p class="checked-status"> </p>
                                                    <input type="checkbox" class="form-check-input d-none" id="check1" value="yes">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="option-div">
                                    <div class="row">
                                        <div class="col-12 radio-outer">
                                            <div class="option-preview min-max-132 updated-img" style="display:none">
                                                <img src="" class="option-preview-image" style="display:none" />
                                            </div>
                                            <div class="input-group input-group-tpt mb--8">
                                                <div class="input-group-append left cursor-pointer">
                                                    ${Constants.getUploadOptionImageIcon()}
                                                    <input type="file" name="option_image" class="d-none" accept="image/*" id="option-image-2"/>
                                                </div>
                                                <input type="text" class="form-control in-t opt-cls pl--32" placeholder="Enter your choice" aria-label="Option 2" aria-describedby="basic-addon2" id="option2" maxlength="1000">
                                                <div class="input-group-append input-tpt trash-ic cursor-pointer" tabindex="0" role="button">
                                                    <span class="remove-option">
                                                        ${Constants.getTrashIcon()}
                                                    </span>
                                                </div>
                                                <div class="input-group-append check-opt check-me-title" title="${checkMeKey}"  tabindex="0" role="checkbox">
                                                    <span class="input-group-text input-tpt cursor-pointer">
                                                        ${Constants.getDefaultTickIcon()}
                                                    </span>
                                                </div>
                                                <div class="text-right text-success">
                                                    <p class="checked-status"> </p>
                                                    <input type="checkbox" class="form-check-input d-none" value="yes" id="check2">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="">
                                    <button type="button" class="teams-link add-options">
                                        ${Constants.getPlusIcon()} Add options
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getAddQuestionButton() {
        return `<div class="container question_button">
            <div class="form-group">
                <button type="button" class="btn btn-primary btn-sm" id="add-questions-same-section">
                    ${Constants.getPlusIcon()} <span class="add-question-label">Add Questions</span></button>
            </div>
            <div class="discardContent"></div>
        </div>`;
    }

    static getQuestionAreaFooter() {
        return `<div class="footer question-footer" >
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9 d-table">
                            <a class=" cursur-pointer" id="back-question">
                                <span tabindex="0" role="button" data-id="back-question">
                                    ${Constants.getRightCaratIcon()} <span class="back-key"></span>
                                </span>
                            </a>
                        </div>
                        <div class="col-3 text-right">
                            <button type="button" class="btn btn-primary btn-sm pull-right done-label" id="question-done"  tabindex="0" role="button" data-id="question-done"> Done</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * @Method to get Question Edit Section
     * @param  counter string contains Section Id
     * @param  questionTitle string contains Question Title
     * @param  optionChecked string contains correct Options
     */
    static getEditQuestionArea(counter, questionTitle, optionChecked) {
        return `<div class="card-box-question card-box card-border card-bg training-card-section section-div question-section-div" data-id="text-section-${counter}" id="section-${counter}">
            ${optionChecked}
            <div id="quest-text-${j}" class="d-none"></div>
            <div class="d-table mb--4 pre-none">
                <label class="font-12">
                    <strong class="question-number-title bold">
                        <label class="font-12">
                            <span class="question-number">Question # </span><span class="counter">${counter}</span>
                        </label>
                    </strong>
                </label>
                <label class="float-right result-status" id="status-1">
                </label>
                <button type="button" class="close remove-text" data-dismiss="alert">
                    <span aria-hidden="true">
                        ${Constants.getTrashIcon()}
                    </span>
                    <span class="sr-only">Close</span>
                </button>
            </div>
            <div>
                <div class="quiz-updated-img bg-none bdr-none cover-img min-max-132 mb--4" style="{styleQuestionImage}">
                    <p><span id="question_image">${questionImage}</span></p>
                </div>
                <div class="semi-bold font-16 mb--16 question-title">
                    <p><label class="text-justify"><strong class="question">${questionTitle}</strong></label></p>
                </div>
            </div>
            <div class="option-sec">
                ${optionText}
            </div>
            <div class="input_section">
                ${questionInput}
                <textarea class="question-image d-none">${questionImagearray}</textarea>
                ${optionAttachments}
            </div>
        </div>`;
    }

    static getOptionArea(checkMeKey) {
        return `<div style="display: none;" id="option-section">
            <div class="option-div">
                <div class="row">
                    <div class="col-12 radio-outer">
                        <div class="option-preview min-max-132 updated-img" style="display:none">
                            <img src="" class="option-preview-image" style="display:none" />
                        </div>
                        <div class="input-group input-group-tpt mb--8">
                            <div class="input-group-append left cursor-pointer">
                                ${Constants.getUploadOptionImageIcon()}
                                <input type="file" name="option_image" class="d-none" accept="image/*" id="option-image-1"/>
                            </div>
                            <input type="text" class="form-control in-t opt-cls pl--32" placeholder="Enter your choice" aria-label="Recipient's username" aria-describedby="basic-addon2" id="option-1" maxlength="1000">
                            <div class="input-group-append input-tpt trash-ic cursor-pointer remove-option-href" tabindex="0" role="button">
                                <span class="remove-option">
                                    ${Constants.getTrashIcon()}
                                </span>
                            </div>
                            <div class="input-group-append check-opt check-me-title" title="${checkMeKey}"  tabindex="0" role="checkbox">
                                <span class="input-group-text input-tpt cursor-pointer">
                                    ${Constants.getDefaultTickIcon()}
                                </span>
                            </div>
                            <div class="text-right text-success">
                                <p class="checked-status"> </p>
                                <input type="checkbox" class="form-check-input" value="yes" id="check2" style="display:none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getTextContentArea() {
        return `<div class="text-section">
            <div class="container">
                <div id="row" class="row">
                    <div class="col-sm-12 mb--16">
                        <input type="url" class="form-control in-t semi-bold" name="text_title" id="training-text" value="" placeholder="Add content title">
                    </div>
                    <div class="col-sm-12">
                        <textarea class="font-12 in-t form-control text-label-placeholder" rows="8" id="training-text-description" placeholder="Add Text"></textarea>
                    </div>
                    <div class="col-sm-12 discardContent"></div>
                </div>
            </div>
        </div>`;
    }

    static getTextContentAreaEdit() {
        return `<div class="text-section">
            <div class="container">
                <div id="row" class="row">
                    <div class="col-sm-12 mb--16">
                        <input type="url" class="form-control in-t semi-bold" name="text_title" id="training-text" value="" placeholder="Add content title">
                    </div>
                    <div class="col-sm-12">
                        <textarea class="font-12 in-t form-control text-label-placeholder" rows="8" id="training-text-description" placeholder="Add Text"></textarea>
                    </div>
                    <div class="col-sm-12 discardContent"></div>
                </div>
            </div>
        </div>`;
    }

    static getTextContainerEdit(counter, displayName, description, loaderClass, loaderCss, loaderButton) {
        return `<div class="card-box card-bg card-border training-card-section section-div text-section-div" data-id="text-section-${counter}" id="section-${counter}">
            <div class="d-table mb--4 pre-none">
                <label class="font-14 semi-bold text-break"><span class="type">${displayName}</span></label>
                <label class="float-right result-status" id="status-1">
                    <button type="button" class="close remove-text" data-dismiss="alert">
                        <span class="" aria-hidden="true">
                            ${Constants.getTrashIcon()}
                        </span>
                        <span class="sr-only">Close</span>
                    </button>
                </label>
                <div class="clearfix"></div>
            </div>
            <p class="mb0 text-description-preview text-justify font-12 text-break ${loaderClass}" style="${loaderCss}">${description}</p>
            ${loaderButton}
            <textarea class="textarea-text d-none" >${displayName}</textarea>
            <textarea class="textarea-text-description d-none">${description}</textarea>
        </div>`;
    }

    static getTextContentFooter() {
        return `<div class="footer text-footer" >
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class=" cursur-pointer" id="back-text">
                                <span tabindex="0" role="button" data-id="back-text" style="width: 15%;">
                                    ${Constants.getRightCaratIcon()} <span class="back-key">Back</span>
                                </span>
                            </a>
                        </div>
                        <div class="col-3 text-right">
                            <button type="button" class="btn btn-primary btn-sm pull-right done-label" id="text-done"  tabindex="0" role="button" data-id="text-done"> Done</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getImageContentArea() {
        return `<div class="text-section">
            <div class="container">
                <div id="root" class="">
                    <div class="">
                        <div class="form-group mb--16">
                            <input type="url" class="form-control in-t semi-bold" name="image_text_title" id="image-training-text" value="" placeholder="Add content title">
                        </div>
                        <div class="form-group mb--16">
                            <span class="float-right"><a class="upvj cursor-pointer change-link theme-color mb--4 d-block font-12 semi-bold" style="display:none!important">Edit</a></span>
                            <div class="clearfix"></div>
                            <div class="relative" tabindex="0" role="image">
                                <div class="clearfix"></div>
                                <div class="loader-cover show-image-loader" style="display:none;">
                                    <div class="d-table-cell">
                                        <div class="spinner-border" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="photo-box card cursor-pointer card-bg card-border max-min-220 upvj" >
                                    <span class="tap-upload-photo-label">Upload images</span>
                                </div>
                                <!-- show this div after img added -->
                                <div class="updated-img update-carasoul card card-bg card-border max-min-220" style="display:none">
                                </div>
                            </div>
                        </div>
                        <div class="form-group mb0">
                            <textarea class="font-12 in-t form-control desc-content-about-placeholder" id="photo-description" placeholder="What is the content about? (Optional)"></textarea>
                            <textarea class="d-none" id="photo-attachments" ></textarea>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 discardContent"></div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getImageContentFooter() {
        return `<div class="footer text-footer" >
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class=" cursur-pointer" id="back-photo">
                                <span tabindex="0" role="button" data-id="back-photo">
                                    ${Constants.getRightCaratIcon()} <span class="back-key">Back</span>
                                </span>
                            </a>
                        </div>
                        <div class="col-3 text-right"> <button type="button" tabindex="0" role="button" data-id="photo-done" class="btn btn-primary btn-sm pull-right done-label" id="photo-done"> Done</button></div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getVideoContentArea() {
        return `<div class="text-section" >
            <div class="container">
                <div id="root" class="">
                    <div class="">
                        <div class="form-group mb--16">
                            <input type="url" class="form-control in-t semi-bold" name="video_text_title" id="video-training-text" value="" placeholder="Add content title">
                        </div>
                        <div class="form-group mb--16">
                            <span class="float-right mb--4"><a class="upvj cursor-pointer change-link theme-color edit-key font-12 semi-bold" style="display:none">Edit</a></span>
                            <div class="clearfix"></div>
                            <div class="relative">

                                <div class="loader-cover video-loader" style="display: none;">
                                    <div class="d-table-cell">
                                        <div class="spinner-border" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="video-box card card-bg card-border max-min-220 upvj cursor-pointer"  tabindex="0" role="image">
                                    <span class="tap-upload-video-label">Tap to upload video</span>
                                </div>
                                <div class="updated-video card card-bg card-border max-min-220" style="display:none">
                                    <div class="embed-responsive embed-responsive-21by9">
                                        <video controls class="video video-section-preview">
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mb0">
                            <textarea class="font-12 in-t form-control desc-content-about-placeholder" id="video-description" placeholder="What is the content about? (Optional)"></textarea>
                            <textarea class="d-none" id="video-attachments" ></textarea>
                        </div>
                        <div class="form-group">
                            <div class="discardContent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getVideoContentFooter() {
        return `<div class="footer text-footer" >
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9 d-table">
                            <a class=" cursur-pointer" id="back-video">
                                <span tabindex="0" role="button" data-id="back-video">
                                    ${Constants.getRightCaratIcon()} <span class="back-key">Back</span>
                                </span>
                            </a>
                        </div>
                        <div class="col-3 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right done-label" tabindex="0" role="button" data-id="video-done" id="video-done"> Done</button></div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getDocumentContentArea() {
        return `<div class="text-section" >
            <div class="container">
                <div id="root" class="">
                    <div class="">
                        <div class="form-group mb--16">
                            <input type="url" class="form-control in-t semi-bold" name="text_doc_title" id="doc-training-text" value="" placeholder="Add content title">
                        </div>
                        <div class="form-group mb--16">
                            <span class="float-right mb--4"><a class="upvj cursor-pointer change-doc-link theme-color font-12 semi-bold" style="display:none">Edit</a></span>
                            <div class="clearfix"></div>
                            <div class="relative">

                            <div class="loader-cover show-document-loader" style="display:none;">
                                <div class="d-table-cell">
                                    <div class="spinner-border" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </div>

                                <!-- hide this div afte img added -->
                                <div class="doc-box card card-bg card-border max-min-220 upvj cursor-pointer" tabindex="0" role="doc">
                                    <span class="tap-upload-files-label">Tap to upload files</span>
                                </div>
                                <!-- show this div afte img added -->
                                <div class="doc-name">
                                </div>
                            </div>
                        </div>
                        <div class="form-group mb0">
                            <textarea class="in-t form-control desc-content-about-placeholder font-12" id="document-description" placeholder="What is the content about? (Optional)"></textarea>
                            <textarea id="document-attachment" class="d-none"></textarea>
                        </div>
                        <div class="form-group">
                            <div class="discardContent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getDocumentContentFooter() {
        return `<div class="footer text-footer" >
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9 d-table">
                            <a>
                                <span tabindex="0" role="button" data-id="back-photo" class=" cursur-pointer" id="back-photo">
                                    ${Constants.getRightCaratIcon()} <span class="back-key">Back</span>
                                </span>
                            </a>
                        </div>
                        <div class="col-3 text-right">
                            <button type="button" class="btn btn-primary btn-sm pull-right done-label" id="document-done"  tabindex="0" role="button" data-id="document-done"> Done</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getSettingContentArea(dueByKey, resultVisibleToKey, everyoneKey, onlyMeKey, showCorrectAnswerKey, answerCannotChangeKey, allowMultipleAttemptKey, assigneeTakeMultipleTraining) {
        return `<div style="display:none" id="setting">
            <div class="container setting-section">
                <div class="row">
                    <div class="col-sm-12">
                        <label class="mb--8"><strong class="due-by-key bold">${dueByKey}</strong></label>
                    </div>
                    <div class="clearfix"></div>
                    <div class="col-6 pr--4">
                        <div class="input-group date form_date" data-date="1979-09-16T05:25:07Z" data-date-format="M dd, yyyy" data-link-field="dtp_input1">
                            <input class="form-control in-t" size="16" name="expiry_date" type="text" value="" readonly>
                        </div>
                    </div>
                    <div class="col-6 pl--4">
                        <div class="input-group date form_time" data-date="" data-date-format="hh:ii" data-link-field="dtp_input3" data-link-format="hh:ii">
                            <input class="form-control in-t" name="expiry_time" size="16" type="text" value="" readonly>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="d-none">
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
                    </div>
                    <div class="col-12 mt--24">
                        <div class="input-group form-check custom-check-outer" tabindex="0" role="checkbox">
                            <label class="custom-check form-check-label">
                                <input type="checkbox" name="show_correctAnswer" id="show-correct-answer" value="Yes" tabindex="1" />
                                <span class="checkmark"></span>
                                <span class="show-correct-key setting-label">${showCorrectAnswerKey}</span><br>
                            </label><br>
                            <span class="answer-cannot-change-key sub-text font-12 mt--4 d-block">${answerCannotChangeKey}</span>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="col-12 mt--24">
                        <div class="input-group  form-check custom-check-outer" tabindex="0" role="checkbox">
                            <label class="custom-check form-check-label">
                                <input type="checkbox" name="allow_multiple_attempt" id="allow-multiple-attempt" value="Yes" checked="" tabindex="1" >
                                <span class="checkmark"></span>
                                <span class="allow-multiple-attempt setting-label">${allowMultipleAttemptKey}Allow Multiple attempts</span><br>
                            </label>
                            <br>
                            <span class="allow-multiple-change-key sub-text font-12 mt--4 d-block">${assigneeTakeMultipleTraining}</span>
                        </div>
                    </div><br>
                    <div class="clearfix"></div><br>
                    <div class="col-12 mt--32">
                        <small class="invalid-date-error"></small>
                    </div>
                </div>
                <div class="footer">
                    <div class="footer-padd bt">
                        <div class="container ">
                            <div class="row">
                                <div class="col-9">
                                    <div class="d-table">
                                        <a id="back">
                                            <span tabindex="0" class="cursor-pointer" role="button" data-id="back">
                                                ${Constants.getRightCaratIcon()} <span class="back-key">Back</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-3">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }

    static getLoaderContentArea() {
        return `<div class="loader-overlay">
            <div class="loader-outer">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>`;
    }

    static getDiscardContentArea() {
        return `<div class="d-flex-alert mt--32">
            <div class="pr--8">
                <label class="confirm-box text-danger"> Are you sure want to discard this content? </label>
            </div>
            <div class=" pl--8 text-right">
                <button type="button" class="btn btn-primary-outline btn-sm cancel cancel-question-delete mr--8">Cancel</button><button type="button" class="btn btn-primary btn-sm discard-success">Discard</button>
            </div>
        </div>`;
    }

    static getTextConfirmBox(dataId) {
        return `<div class="confirm-box mt--16">
            <div class="d-flex-alert mb--8">
                <div class="pr--8">
                    <label class="confirm-box text-danger"> Are you sure you want to delete? </label>
                </div>
                <div class=" pl--8 text-right">
                    <button class="btn btn-primary btn-sm pull-right" data-id="${dataId}" id="confirm-delete-text">Ok</button>
                    <button class="btn btn-primary-outline btn-sm pull-right mr--8" id="cancel-confirm">Close</button>
                </div>
        </div>`;
    }

    static getDeleteQuestionConfirmBox(dataId, ok, close) {
        return `<div class="confirm-box">
            <hr class="hr-danger">
            <ul class="d-flex table-remove mb-0">
                <li><span class="text-danger">Are you sure you want to delete?</span></li>
                <li>
                    <button class="btn btn-primary btn-sm pull-right" data-id="${dataId}" id="delete-question">${ok}</button>
                    <button class="btn btn-primary-outline btn-sm pull-right mr--8" id="cancel-confirm">${close}</button>
                </li>
            </ul>
        </div>`;
    }

    static getQuestionNumber(questionKey, questionCounter) {
        return `<span class="question-key">${questionKey}</span>&nbsp;#&nbsp;${questionCounter}`;
    }

    static getAtLeastOneQuestionError(result) {
        return `<div class="alert alert-danger error-msg">${result}</div>`;
    }

    static getAddTextContainer(textData) {
        return `<div class="card-box card-bg card-border training-card-section section-div text-section-div">
            <div class="d-table mb--4 pre-none">
                <label class="font-16 semi-bold text-break"><span class="type">Text</span></label>
                <label class="float-right result-status" id="status-1">
                    <button type="button" class="close remove-text" data-dismiss="alert">
                        <span class="" aria-hidden="true">
                            ${Constants.getTrashIcon()}
                        </span>
                        <span class="sr-only">Close</span>
                    </button>
                </label>
                <div class="clearfix"></div>
            </div>
            <p class="text-break mb0 mt--8 text-description-preview text-justify font-12">${textData}</p>
            <textarea class="textarea-text d-none" ></textarea>
            <textarea class="textarea-text-description d-none"></textarea>
        </div>`;
    }

    static getAddTextContainerEdit(displayName, description) {
        return `<div class="card-box card-bg card-border training-card-section section-div text-section-div">
            <div class="d-table mb--4 pre-none">
                <label class="font-16 semi-bold text-break"><span class="type">${displayName}</span></label>
                <label class="float-right result-status" id="status-1">
                    <button type="button" class="close remove-text" data-dismiss="alert">
                        <span class="" aria-hidden="true">
                            ${Constants.getTrashIcon()}
                        </span>
                        <span class="sr-only">Close</span>
                    </button>
                </label>
                <div class="clearfix"></div>
            </div>
            <p class="mb0 text-description-preview text-justify font-12 text-break ">${description}</p>
            <textarea class="textarea-text d-none" >${displayName}</textarea>
            <textarea class="textarea-text-description d-none">${description}</textarea>
        </div>`;
    }

    static getRequiredError(requiredKey) {
        return `<label class="label-alert d-block mb--4">${requiredKey}</label>`;
    }

    static getAddImageSection(textNumber, textData) {
        return `<div class="card-box card-bg card-border training-card-section section-div photo-section-div">
            <div class="form-group">
                <div class="row">
                    <div class="col-12">
                        <div class="hover-btn">
                            <div class="d-table mb--4 pre-none">
                                <label class="font-16 semi-bold text-break"><span class="type">Image</span></label>
                                <label class="float-right result-status" id="status-1">
                                    <button type="button" class="close remove-text" data-dismiss="alert">
                                        <span aria-hidden="true" class="input-group-text remove-image-section input-tpt cursor-pointer">
                                            ${Constants.getTrashIcon()}
                                        </span>
                                        <span class="sr-only">Close</span>
                                    </button>
                                </label>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="img-thumbnail-new updated-img card card-bg card-border max-min-220">
                            <img class="d-block w-100" id="image-sec-${textNumber}">
                        </div>
                    </div>
                    <div class="col-12">
                        <p class="photo-description-preview text-justify font-12 text-break mt--16">${textData}</p>
                    </div>
                </div>
            </div>
            <textarea class="textarea-photo-title d-none" >${textData}</textarea>
            <textarea class="textarea-photo-description d-none" >${textData}</textarea>
            <textarea class="textarea-photo-attachments d-none" ></textarea>
            <input type="file" id="upload-photo" class="in-t form-control d-none" accept="image/*" src="images/px-img.png" multiple>
        </div>`;
    }

    /**
     * @Method to get HTML Image Edit Section
     * @param  counter string contains section Id
     * @param  imageTitle string contains image Title
     * @param  imageDescription string contains Image Description
     * @param  imageAttachments string contains Image Attachments
     */
    static getEditImageSection(counter, imageTitle, imageDescription, imageAttachments, loaderClass, loaderCss, loaderButton) {
        return `<div class="card-box card-bg card-border training-card-section section-div photo-section-div" data-id="text-section-${counter}" id="section-${counter}">
            <div class="form-group">
                <div class="row">
                    <div class="col-12">
                        <div class="hover-btn">
                            <div class="d-table mb--4 pre-none">
                                <label class="font-16 semi-bold text-break"><span class="type">${imageTitle}</span></label>
                            </div>
                            <label class="float-right result-status" id="status-1">
                                <button type="button" class="close remove-text" data-dismiss="alert">
                                    <span aria-hidden="true" class="input-group-text remove-image-section input-tpt cursor-pointer">
                                        ${Constants.getTrashIcon()}
                                    </span>
                                    <span class="sr-only">Close</span>
                                </button>
                            </label>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="edit-carasoul-here updated-img card card-bg card-border max-min-220">
                        </div>
                    </div>
                    <div class="col-12">
                        <p class="photo-description-preview text-justify font-12 text-break ${loaderClass}" style="${loaderCss}">${imageDescription}</p>
                        ${loaderButton}
                    </div>
                </div>
            </div>
            <textarea class="textarea-photo-title d-none" >${imageTitle}</textarea>
            <textarea class="textarea-photo-description d-none" >${imageDescription}</textarea>
            <textarea class="textarea-photo-attachments d-none" >${imageAttachments}</textarea>
            <input type="file" id="upload-photo" class="in-t form-control d-none" accept="image/*" src="images/px-img.png" multiple>
        </div>`;
    }

    static getCarousalSliders(carousalIndicator, uniqueId) {
        return `<div id="${uniqueId}" class='carousel slide' data-ride='carousel'>${carousalIndicator}</div>`;
    }

    static getAddVideoSection(textNumber, textData) {
        return `<div class="card-box card-bg card-border training-card-section section-div video-section-div">
            <div class="form-group">
                <div class="hover-btn">
                    <div class="d-table mb--4 pre-none">
                        <label class="font-16 semi-bold text-break"><span class="type">Video</span></label>
                        <label class="float-right result-status" id="status-1">
                            <button type="button" class="close remove-text" data-dismiss="alert">
                                <span aria-hidden="true">
                                    ${Constants.getTrashIcon()}
                                </span>
                                <span class="sr-only">Close</span>
                            </button>
                        </label>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="row">
                    <div class="col-12">
                        <div class="embed-responsive embed-responsive-21by9">
                            <video controls class="video" id="video-sec-${textNumber}">
                            </video>
                        </div>
                    </div>
                    <div class="col-12">
                        <p class="mt--16 font-12 video-description-preview text-justify text-break">${textData}</p>
                    </div>
                </div>
            </div>
            <textarea class="textarea-video d-none">${textData}</textarea>
            <textarea class="textarea-video-description d-none">${textData}</textarea>
            <textarea class="textarea-video-attachments d-none" ></textarea>
            <input type="file" id="upload-video" accept=".mp4,.webm,.ogg,.ogv" src="images/px-img.png" class="d-none">
        </div>`;
    }

    /**
     *  @Method to get HTML Video Edit Section
     * @param  counter string contains Section Id
     * @param  videoTitle string contains Video Title
     * @param  videoDescription string contains Video Description
     * @param  videoAttachment string contains Video Attachment
     * @param  videoDownloadURL string contains VideoURL
     */
    static getEditVideoSection(counter, videoTitle, videoDescription, videoAttachment, videoDownloadURL, loaderClass, loaderCss, loaderButton) {
        return `<div class="card-box card-bg card-border training-card-section section-div video-section-div" data-id="text-section-${counter}" id="section-${counter}">
                <div class="form-group">
                    <div class="hover-btn">
                        <div class="d-table mb--4 pre-none">
                            <label class="font-16 semi-bold text-break">${videoTitle}<span class="type"></span></label>
                            <label class="float-right result-status" id="status-1">
                                <button type="button" class="close remove-text" data-dismiss="alert">
                                    <span aria-hidden="true">
                                        ${Constants.getTrashIcon()}
                                    </span>
                                    <span class="sr-only">Close</span>
                                </button>
                            </label>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="row">
                        <div class="col-12">
                            <div class="embed-responsive embed-responsive-21by9">
                                <video src="${videoDownloadURL}" controls class="video" id="video-sec-${counter}">
                                </video>
                            </div>
                        </div>
                        <div class="col-12">
                            <p class="mt--16 font-12 video-description-preview text-justify text-break ${loaderClass}" style="${loaderCss}">${videoDescription}</p>
                            ${loaderButton}
                        </div>
                    </div>
                </div>
                <textarea class="textarea-video d-none">${videoTitle}</textarea>
                <textarea class="textarea-video-description d-none">${videoDescription}</textarea>
                <textarea class="textarea-video-attachments d-none" >${videoAttachment}</textarea>
            </div>`;
    }

    static getAttachmentTextarea() {
        return `<textarea id="attachment-id" class="d-none"></textarea>`;
    }

    static getAddDownloadSection(textNumber, textData) {
        return `<div class="card-box card-bg card-border training-card-section section-div document-section-div">
            <div class="form-group">
                <div class="hover-btn">
                    <div class="d-table mb--4 pre-none">
                        <label class="font-16 semi-bold text-break"><span class="type"> Document</span></label>
                        <label class="float-right result-status" id="status-1">
                            <button type="button" class="close remove-text" data-dismiss="alert">
                                <span aria-hidden="true">
                                    ${Constants.getTrashIcon()}
                                </span>
                                <span class="sr-only">Close</span>
                            </button>
                        </label>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p class="mt--16 font-12 document-description-preview text-break text-justify">${textData}</p>
                </div>
                <div class="col-12" style="display:none;">
                    <div class="img-thumbnail">
                        <img id="image-sec-${textNumber}">
                    </div>
                </div>
            </div>
            <textarea class="textarea-document" style="display:none">${textData}</textarea>
            <textarea class="textarea-document-description" style="display:none;">${textData}</textarea>
            <textarea class="textarea-document-attachment" style="display:none;"></textarea>
            <input type="file" id="upload-document" accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf" src="images/px-img.png" style="width:100%; height: 180px; display:none">
        </div>`;
    }

    /**
     * @Method contains Document Edit Section 
     * @param  counter string contains Document Section Id
     * @param  documentTitle string contains Document Title
     * @param  documentDescription string contains Document Description
     * @param  documentAtachment string contains Attachment json string
     * @param  fileTypeIcon string contains File Icon
     */
    static getEditDownloadSection(counter, documentTitle, documentDescription, documentAtachment, fileTypeIcon = '', loaderClass, loaderCss, loaderButton) {
        return `<div class="card-box card-bg card-border training-card-section section-div document-section-div" data-id="text-section-${counter}" id="section-${counter}">
            <div class="form-group">
                <div class="hover-btn">
                    <div class="d-table mb--4 pre-none">
                        <label class="font-16 semi-bold text-break">${documentTitle}<span class="type"></span></label>
                        <label class="float-right result-status" id="status-1">
                            <button type="button" class="close remove-text" data-dismiss="alert">
                                <span aria-hidden="true">
                                    ${Constants.getTrashIcon()}
                                </span>
                                <span class="sr-only">Close</span>
                            </button>
                        </label>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="row">
                <div class="col-12 doc-name">
                    <p class="mb0 doc-name">${fileTypeIcon}&nbsp;<span class="semi-bold teams-link a-link font-14">${JSON.parse(documentAtachment).name}</span></p>
                </div>
                <div class="col-12">
                    <p class="mt--16 font-12 document-description-preview text-break text-justify ${loaderClass}" style="${loaderCss}">${documentDescription}</p>
                    ${loaderButton}
                </div>
                <div class="col-12" style="display:none;">
                    <div class="img-thumbnail">
                        <img id="image-sec-${counter}">
                    </div>
                </div>
            </div>
            <textarea class="textarea-document" style="display:none">${documentTitle}</textarea>
            <textarea class="textarea-document-description" style="display:none;">${documentDescription}</textarea>
            <textarea class="textarea-document-attachment" style="display:none;">${documentAtachment}</textarea>
            <input type="file" id="upload-document" accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf" src="images/px-img.png" style="width:100%; height: 180px; display:none">
        </div>`;
    }

    static getCarousalImages(count, resultLocale) {
        return `<div class="carousel-item 12456 ${count == 0 ? "active" : ""}">
            <img class="d-block w-100" src="${resultLocale}" alt="${count+1} slide">
        </div>`;
    }

    static getCarousalPagination(uniqueId) {
        return `<a class="carousel-control-prev" href="#carouselExampleIndicators${uniqueId}" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators${uniqueId}" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>`;
    }

    static getAtLeastOneContainerError(atleastOneContentKey) {
        return `<div class="text-danger error-msg at-least-one-content-key mt--32">${atleastOneContentKey}</div>`;
    }

    /* Summary View Section */
    static getRespondersContainerData(responderId, initials, name, date) {
        return `<tr id="${responderId}" class="getresult cursur-pointer" tabindex="0" role="button">
            <td>
                <div class="d-flex">
                    <div class="avtar">
                        ${initials}
                    </div>
                    <div class="avtar-txt">${name}</div>
                </div>
            </td>
            <td  class="text-right date-txt">
                ${date}
                ${Constants.getLeftCaratIcon()}
                <p class="semi-bold pr--8">Score: 0%</p>
            </td>
        </tr>`;
    }

    static getSummaryViewResponderSummaryFooter(userId, resultLocale) {
        return `<div class="footer">
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class="cursur-pointer back1" userid-data="${userId}" id="hide2" tabindex="0" role="button">
                                ${Constants.getRightCaratIcon()}
                                ${resultLocale}
                            </a>
                        </div>
                        <div class="col-3">
                            <button class="btn btn-tpt">&nbsp;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    static getSummaryViewTabFooter(resultLocale) {
        return `<div class="footer">
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row"><div class="col-9">
                        <a class="cursur-pointer back" id="hide2">
                            ${Constants.getRightCaratIcon()}
                            ${resultLocale}
                        </a>
                    </div>
                        <div class="col-3">
                            <button class="btn btn-tpt">&nbsp;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * @Method contains quiz Tile section in responder view
     * @param title string contains quiz title
     */
    static getQuizTitleResponders(title) {
        return `<h4 class="mb--8 text-break">${title}</h4>`;
    }

    /**
     * @Method contains quiz Tile section
     * @param title string contains quiz title
     */
    static getQuizTitle(title) {
        return `<label class="font-12"><h4>${title}</h4></label>`;
    }

    /**
     * @Method contains quiz description section
     * @param description string contains quiz description
     */
    static getQuizDescription(description) {
        return `<p class="mb--8 text-justify text-break font-12">${description}</p>`;
    }

    /**
     * @Method contains initals section area
     * @param nonresponderId string contains nonresponders identifiers
     * @param initials string non repsonders initials
     * @param resultLocale string contains localization result string
     */
    static getInitials(nonresponderId, initials, resultLocale) {
        return `<div class="d-flex cursor-pointer" id="${nonresponderId}">
            <div class="avtar">
                ${initials}
            </div>
            <div class="avtar-txt">${resultLocale}</div>
        </div>`;
    }

    /**
     * @Method contains total people responded area in summary view
     * @param xofy string total number of responders out of total members in the group
     */
    static getTotalPeopleRespondedString(xofy) {
        return `<p class="date-color cursor-pointer mb--24">
            <span id="show-responders" class="under-line" tabindex="0" role="button">${xofy}</span>
        </p>`;
    }

    /**
     * @Method contains Participation progress bar
     * @param resultLocale String contains Localization of participation string
     * @param participationPercentage Float contains participation percentage
     */
    static getParticipationProgress(resultLocale, participationPercentage) {
        return `<label class="mb--8">
            <strong classs="semi-bold">
                ${resultLocale}
            </strong>
        </label>
        <div class="progress mb--8">
            <div class="progress-bar bg-primary" role="progressbar" style="width: ${participationPercentage}%" aria-valuenow="${participationPercentage}" aria-valuemin="0" aria-valuemax="100">
            </div>
        </div>`;
    }

    /**
     * @Method contains quiz template image
     * @param downloadUrl String contains image url
     * @param attachments Object contains attachment data
     */
    static loadQuizTemplateImage(downloadUrl, attachments) {
        $("#quiz-img-preview, #quiz-title-image").attr("src", downloadUrl);
        $(".photo-box").hide();
        $(".quiz-updated-img").show();
        $(".quiz-updated-img").show();
        $("#quiz-title-image").show();
        $(".quiz-updated-img").show();
        $(".quiz-clear").show();
        $("#cover-image").after(this.createQuizTextarea(attachments));
    }

    /**
     * @Method contains question image section
     * @param questionSelector String selector
     * @param questionImage String selector
     * @param url String contains image url
     * @param attachmentData Object contains attachment data
     */
    static loadQuestionImage(questionSelector, questionImage, url, attachmentData) {
        $(questionSelector).find(".question-preview").show();
        $(questionSelector).find(".question-preview-image").show();
        $(questionSelector).find(".question-preview-image").attr("src", url);
        $(questionImage).after(this.createQuestionTextarea(attachmentData));
    }

    /**
     * @Method contains option image section
     * @param questionSelector String selector
     * @param optionCounter String contians option number as identifiers
     * @param url String contains image url
     * @param attachmentData Object contains attachment data
     */
    static loadOptionImage(questionSelector, optionCounter, url, attachmentData) {
        $(questionSelector).find("#option" + optionCounter).parents("div.col-12").find(".option-preview").show();
        $(questionSelector).find("#option" + optionCounter).parents("div.col-12").find(".option-preview-image").show();
        $(questionSelector).find("#option" + optionCounter).parents("div.col-12").find(".option-preview-image").attr("src", url);
        $(questionSelector).find("input[type='file']#option-image-" + optionCounter).after(`<textarea id="option-attachment-set" class="d-none">${JSON.stringify(attachmentData)}</textarea>`);
    }

    /**
     * Method to get remove Image loader from image section
     * @param selector object html on which remove image
     */
    static removeImageLoader(selector) {
        let tid = setInterval(() => {
            if ($(selector).hasClass("heightfit") || $(selector).hasClass("widthfit") || $(selector).hasClass("smallfit")) {
                $(selector).parent("div").find(".loader-cover").addClass("d-none");
                clearInterval(tid);
            }
        }, Constants.setIntervalTimeHundred());
    }

    /**
     * Method to get remove Image loader from image section
     * @param selector object html on which remove image
     */
    static removeImageLoaderCreationView(selector) {
        let tid = setInterval(() => {
            if ($(selector).hasClass("heightfit") || $(selector).hasClass("widthfit") || $(selector).hasClass("smallfit")) {
                $(".loader-cover").addClass("d-none");
                clearInterval(tid);
            }
        }, Constants.setIntervalTimeHundred());
    }

    /**
     * @Method contains responders quiz date
     * @param expiryTime string contains quiz expiry time
     * @param currentTimestamp string contains current date timestamp
     * @param dueByKey string contains Localization of due by string
     * @param expiredOnKey string contains Localization of expired on string
     * @param dueby string contains due by date
     */
    static getResponderQuizDate(expiryTime, currentTimestamp, dueByKey, expiredOnKey, dueby) {
        return `<p class="date-text mb--16 font-12">${expiryTime > currentTimestamp ? dueByKey + " " : expiredOnKey + " "} ${dueby}</p>`;
    }

    /**
     * @Method contains creator view quiz date section marked under ...
     * @param changeDueByKey string contains Localization of change quiz date
     * @param closeTrainingKey string contains Localization of close quiz
     * @param deleteTrainingKey string contains Localization of delete quiz
     */
    static creatorQuizDateManageSection(changeDueByKey, closeTrainingKey, deleteTrainingKey) {
        return `<label class="float-right font-12 bold" id="status-1"><span class="semi-bold">
                <div class="threedots dropdown">
                    <button type="button" class="btn btn-tpt btn-plain dropdown-toggle" data-toggle="dropdown" tabindex="0" role="button">
                        <svg role="presentation" focusable="false" viewBox="8 8 16 16" class=""><g class="ui-icon__filled"><circle cx="22" cy="16" r="2"></circle><circle cx="16" cy="16" r="2"></circle><circle cx="10" cy="16" r="2"></circle></g><g class="ui-icon__outline cw"><circle cx="22" cy="16" r="1.5"></circle><circle cx="16" cy="16" r="1.5"></circle><circle cx="10" cy="16" r="1.5"></circle></g></svg>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a class="dropdown-item change-due-by-event" tabindex="0" role="button">
                            ${Constants.getChangeDueDateIcon()}
                            <span class="change-due-by-key">${changeDueByKey}</span>
                        </a>
                        <a class="dropdown-item close-quiz-event" tabindex="0" role="button">
                            ${Constants.getCloseQuizDateIcon()}
                            <span class="close-quiz-key">${closeTrainingKey}</span>
                        </a>
                        <a class="dropdown-item delete-quiz-event" tabindex="0" role="button">
                            ${Constants.getDeleteQuizIcon()}
                            <span class="delete-quiz-key">${deleteTrainingKey}</span>
                        </a>
                    </div>
                </div>
            </span></label>`;
    }

    /**
     * @Method to get change date section in summary view
     * @param changeDueDateKey string Localization for change due date string
     * @param cancelKey string Localization for cancel string
     * @param changeKey string Localization for change string
     */
    static getChangeDateSection(changeDueDateKey, cancelKey, changeKey) {
        return `<div class="change-date">
            <div class="card-box card-bg card-border">
                <div class="row">
                    <div class="col-sm-12">
                        <h4 class="mb--8"><strong class="due-by-key bold change-due-date-key">${changeDueDateKey}</strong></h4>
                    </div>
                    ${this.clearFix()}
                    <div class="col-6 pr--4">
                        <div class="input-group date form_date" data-date="1979-09-16T05:25:07Z" data-date-format="M dd, yyyy" data-link-field="dtp_input1">
                            <input class="form-control in-t" size="16" name="expiry_date" type="text" value="" readonly>
                        </div>
                    </div>
                    <div class="col-6 pl--4">
                        <div class="input-group date form_time" data-date="" data-date-format="hh:ii" data-link-field="dtp_input3" data-link-format="hh:ii">
                            <input class="form-control in-t" name="expiry_time" size="16" type="text" value="" readonly>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="d-flex-alert mt--16 mb--8">
                            <div class="pl--8 text-right">
                                <button type="button" class="btn btn-primary-outline btn-sm cancel-question-delete mr--8 cancel-key">${cancelKey}</button><button type="button" class="btn btn-primary btn-sm disabled change-key" id="change-quiz-date">${changeKey}</button>
                            </div>
                        </div>
                    </div>
                    ${this.clearFix()}
                </div>
            </div>
        </div>`;
    }

    /**
     * @Method to get close quiz section in summary view
     * @param closeTrainingKey string Localization for close quiz string
     * @param closeTrainingConfirmKey string Localization for close quiz confirmation string
     * @param cancelKey string Localization for cancel string
     * @param confirmKey string Localization for confirm string
     */
    static getCloseTrainingSection(closeTrainingKey, closeTrainingConfirmKey, cancelKey, confirmKey) {
        return `<div class="close-quiz">
            <div class="card-box card-bg card-border">
                <div class="row">
                    <div class="col-sm-12">
                        <h4 class="mb--8"><strong class="due-by-key bold close-quiz-key">${closeTrainingKey}</strong></h4>
                    </div>
                    ${this.clearFix()}
                    <div class="col-12">
                        <label class="confirm-box text-danger close-quiz-confirm-key">${closeTrainingConfirmKey}</label>
                        <div class="d-flex-alert mt--16 mb--8">
                            <div class=" pl--8 text-right">
                                <button type="button" class="btn btn-primary-outline btn-sm cancel-question-delete mr--8 cancel-key">${cancelKey}</button><button type="button" class="btn btn-primary btn-sm confirm-key" id="change-quiz-question">${confirmKey}</button>
                            </div>
                        </div>
                    </div>
                    ${this.clearFix()}
                </div>
            </div>
        </div>`;
    }

    /**
     * @Method contains delete quiz section
     * @param deleteTrainingKey string Localization for delete quiz string
     * @param deleteTrainingConfirmKey string Localization for delete quiz confirmation string
     * @param cancelKey string Localization for cancel string
     * @param confirmKey string Localization for confirm string
     */
    static deleteTrainingSection(deleteTrainingKey, deleteTrainingConfirmKey, cancelKey, confirmKey) {
        return `<div class="delete-quiz">
            <div class="card-box card-bg card-border">
                <div class="row">
                    <div class="col-sm-12">
                        <h4 class="mb--8"><strong class="due-by-key bold delete-quiz-key">${deleteTrainingKey}</strong></h4>
                    </div>
                    ${this.clearFix()}
                    <div class="col-12">
                        <label class="confirm-box text-danger delete-quiz-confirm-key">${deleteTrainingConfirmKey} </label>
                        <div class="d-flex-alert mt--16 mb--8">
                            <div class="pl--8 text-right">
                                <button type="button" class="btn btn-primary-outline btn-sm cancel-question-delete mr--8 cancel-key">${cancelKey}</button><button type="button" class="btn btn-primary btn-sm confirm-key" id="delete-quiz">${confirmKey}</button>
                            </div>
                        </div>
                    </div>
                    ${this.clearFix()}
                </div>
            </div>
        </div>`;
    }

    /**
     * @method for break line
     */
    static breakline() {
        return `<hr class="small">`;
    }

    /**
     * @method for clear fix div
     */
    static clearFix() {
        return `<div class="clearfix"></div>`;
    }

    /**
     * @Method to get download button footer area in summary view
     * @param downloadKey string Localization for download string
     * @param downloadImageKey string Localization for download image string
     * @param downloadCSVKey string Localization for downloa csv string
     */
    static getFooterDownloadButton(downloadKey, downloadImageKey, downloadCSVKey) {
        return `<div class="footer">
            <div class="footer-padd bt">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-right">
                            <div class="dropdown btn-group">
                                <button type="button" class="btn btn-primary  dd-btn" id="downloadImage"  data-toggle="dropdown" data-bind="enable: !noResults()">
                                    <span class="span1 add-content-label" id="download-key">${downloadKey}</span>
                                </button>
                                <button type="button" class="btn btn-primary   dropdown-toggle dd-btn" data-toggle="dropdown" aria-expanded="false">
                                        <span class="span2">
                                        <svg role="presentation" fill="#fff" width="16" height="16" focusable="false" viewBox="8 5 16 16" ><path class="ui-icon__outline cw" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z"></path><path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z"></path></svg>
                                    </span>
                                </button>
                                <ul class="dropdown-menu" style="top:22px">
                                    <li class="cursur-pointer" id="downloadImage">
                                    <a id="add-text" tabindex="0" role="button">
                                        <span class="text-label" id="download-image-key">${downloadImageKey}</span></a>
                                    </li>
                                    <li class="cursur-pointer" id="downloadCSV">
                                        <a id="add-photo" tabindex="0" role="button">
                                            <span class="photo-label" id="download-csv-key">${downloadCSVKey}</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * @Method to get close button footer area in summary view
     * @param closeKey string containe close button localization string
     */
    static getFooterCloseArea(closeKey) {
        return `<div class="footer">
            <div class="footer-padd bt">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-right">
                            <button type="button" class="btn btn-primary btn-sm pull-right close-key" id="closeKey"> ${closeKey}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * @Method contains question number area in detail view
     * @param questionKey string localization of question string
     * @param count Integer contains question numner
     */
    static getQuestionNumberContainerResponder(questionKey, count) {
        return `<strong class="question-title semi-bold"><span  class="question-number">${questionKey} # ${count}</span></strong></label> </strong>`;
    }

    /**
     * @Method contains question number area
     * @param questionKey string localization of question string
     * @param count Integer contains question numner
     */
    static getQuestionNumberContainer(questionKey, count) {
        return `<label class="font-12">
                    <strong class="question-title semi-bold">
                        <span  class="question-number font-12 bold">${questionKey} # ${count}</span>
                    </strong>
                </label>`;
    }

    /**
     * @Method contains radio
     * @param optId string contains option id
     * @param ind string contains index number
     * @param text string contains text for radiobox
     */
    static getRadioboxSimple(optId, ind, text) {
        return `<div class="radio-section custom-radio-outer " id="${optId}" columnid="${ind}">
                    <label class="custom-radio d-block font-12 cursor-pointer ">
                        <span class="radio-block"></span>
                        <div class="pr--32 check-in-div font-12">${text}</div>
                    </label>
                </div>`;
    }

    /**
     * @Method contains radio with correct response
     * @param optId string contains option id
     * @param ind string contains index number
     * @param text string contains text for radiobox
     */
    static getCorrectRadiobox(optId, ind, text) {
        return `<div class="radio-section custom-radio-outer " id="${optId}" columnid="${ind}">
                    <label class="custom-radio d-block font-12 cursor-pointer ">
                        <span class="radio-block"></span>
                        <div class="pr--32 check-in-div font-12">${text} &nbsp;
                            <i class="success">
                                ${Constants.getTickIcon()}
                            </i>
                        </div>
                    </label>
                </div>`;
    }

    /**
     * @Method contains checbox area
     * @param optId string contains option id
     * @param ind string contains index number
     * @param text string contains text for radiobox
     */
    static getCheckboxSimple(optId, ind, text) {
        return `<div class="radio-section custom-check-outer " id="${optId}" columnid="${ind}">
                    <label class="custom-check d-block font-12 cursor-pointer ">
                        <span class="checkmark"></span>
                        <div class="pr--32 check-in-div font-12">${text}</div>
                    </label>
                </div>`;
    }

    /**
     * @Method contains checkbox with correct response
     * @param optId string contains option id
     * @param ind string contains index number
     * @param text string contains text for radiobox
     */
    static getCorrectCheckbox(optId, ind, text) {
        return `<div class="radio-section custom-check-outer " id="${optId}" columnid="${ind}">
            <label class="custom-check d-block font-12 cursor-pointer ">
                <span class="checkmark"></span>
                <div class="pr--32 check-in-div font-12">${text} &nbsp;
                    <i class="success">
                        ${Constants.getSuccessTickIcon()}
                    </i>
                </div>
            </label>
        </div>`;
    }

    /**
     * @Method contains question Image with loader
     * @param imageUrl string contains image url
     */
    static getQuestionImageWithLoader(imageUrl) {
        return `<div class="option-image-section relative cover-img min-max-132 mb--4">
            <div class="loader-cover d-table">
                <div class="d-table-cell">
                    <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span></div>
                </div>
            </div>
            <img src="${imageUrl} " class="question-image img-responsive"  crossorigin="anonymous">
        </div>`;
    }

    /**
     * @Method contains option Image with loader
     * @param imageUrl string contains image url
     */
    static getOptionImageWithLoader(imageUrl) {
        return `<div class="option-image-section relative cover-img min-max-132 mb--4">
            <div class="loader-cover d-table">
                <div class="d-table-cell">
                    <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span></div>
                </div>
            </div>
            <img src="${imageUrl}" class="opt-image img-responsive" crossorigin="anonymous">
        </div>`;
    }

    /**
     * @Method contains option Image with loader
     * @param imageUrl string contains image url
     */
    static getOptionImage(imageUrl) {
        return `<div class="option-image-section relative cover-img min-max-132 mb--4">
            <img src="${imageUrl}" class="opt-image img-responsive" crossorigin="anonymous">
        </div>`;
    }

    /**
     * @Method contains quiz image template
     * @param imageUrl string contains image url
     */
    static quizTemplateImageWithLoader(imageUrl) {
        return `<div class="quiz-updated-img relative cover-img min-max-132 mb--8">
            <div class="loader-cover d-table">
                <div class="d-table-cell">
                    <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span></div>
                </div>
            </div>
            <img src="${imageUrl} " class="question-image img-responsive"  crossorigin="anonymous">
        </div>`;
    }

    /**
     * @Method contains score area in response view
     * @param resultLocale string contains localization for result string
     * @param scoreIs Float in two decimal place
     */
    static getScoreResponseView(resultLocale, scoreIs) {
        return `<label>
            <strong class="semi-bold">${resultLocale} </strong>${scoreIs}%
        </label>`;
    }

    /**
     * @Method contains correct answer area
     * @param correctKey String contains localization of correct string
     */
    static getCorrectArea(correctKey) {
        return `<span class="text-success semi-bold">${correctKey}</span>`;
    }

    /**
     * @Method contains incorrect answer area
     * @param incorrectKey String contains localization of incorrect string
     */
    static getIncorrectArea(incorrectKey) {
        return `<span class="text-danger semi-bold">${incorrectKey}</span>`;
    }

    /**
     * @Method contains quiz banner image with loader
     * @param url string contains image url
     */
    static getQuizBannerImageWithLoader(url) {
        return `<div class="quiz-updated-img relative max-min-220 card-bg card-border cover-img upvj cursur-pointer mb--16 bg-none bdr-none">
            <div class="loader-cover d-table">
                <div class="d-table-cell">
                    <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span></div>
                </div>
            </div>
            <img src="${url}" class="image-responsive quiz-template-image" crossorigin="anonymous">
        </div>`;
    }
}
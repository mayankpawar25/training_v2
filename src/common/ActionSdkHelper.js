import * as actionSDK from "@microsoft/m365-action-sdk";
export class Localizer {
    /**
     * Get localized value of the given string id.
     * If any id is not found the same will be returned.
     * @param stringId id of the string to be localized
     * @param args any arguments which needs to passed
     */

    /**
     * Method to get Local string and check contains argument to append or not
     * @param id string identfier
     * @param args additional string that want to append on response string to a position
     */
    static async getString(id, ...args) {
        let request = new actionSDK.GetLocalizedStrings.Request();
        let response = (await actionSDK.executeApi(request));
        let strings = response.strings;
        this.jsonObject = strings;
        if (this.jsonObject && this.jsonObject[id]) {
            return this.getStringInternal(this.jsonObject[id], ...args);
        }
        return this.getStringInternal(id, ...args);
    }

    /**
     * Method to get Local string from local file
     * @param id string identfier
     * @param args additional string that want to append on response string to a position
     */
    static getStringInternal(main, ...args) {
        let formatted = main;
        for (let i = 0; i < args.length; i++) {
            let regexp = new RegExp("\\{" + i + "\\}", "gi");
            formatted = formatted.replace(regexp, args[i]);
        }
        return formatted;
    }
}

export class ActionHelper {
    /**
     * Hide Loader from the Canvas
     */
    static async hideLoader() {
        await actionSDK.executeApi(new actionSDK.HideLoadingIndicator.Request());
    }

    /*
     ** Get Context Request
     */
    static getContextRequest() {
        return new actionSDK.GetContext.Request();
    }

    /*
     ** Execute API
     */
    static async executeApi(request) {
        return await actionSDK.executeApi(request);
    }

    /*
     ** Get Action Request
     */
    static getActionRequest(actionId) {
        return new actionSDK.GetAction.Request(actionId);
    }

    /*
     ** Get Action Data Row Summary
     */
    static getDataRowSummary(actionId, action) {
        return new actionSDK.GetActionDataRowsSummary.Request(actionId, action);
    }

    /*
     ** Get Action Data Row
     */
    static requestDataRows(actionId) {
        return new actionSDK.GetActionDataRows.Request(actionId);
    }

    static batchRequest(args) {
        return new actionSDK.BaseApi.BatchRequest(args);
    }

    /**
     ** Upload Attachment
     */
    static attachmentUpload(file_data, file_type) {
        return actionSDK.AttachmentUtils.creatBlobAttachmentData(file_data, file_type);
    }

    /*
     ** Request Upload Attachment
     */
    static requestAttachmentUplod(attachment) {
        return new actionSDK.UploadAttachment.Request(attachment, function(status) {
            console.log("Status: " + status);
        });
    }

    /*
     ** Get Attachment Info
     */
    static getAttachmentInfo(attachment_img) {
        return new actionSDK.GetAttachmentInfo.Request(attachment_img);
    }

    static getSubscriptionMemberCount(subscription) {
        return new actionSDK.GetSubscriptionMemberCount.Request(subscription);
    }

    static getSusbscriptionMembers(subscription, creatorId) {
        return new actionSDK.GetSubscriptionMembers.Request(subscription, creatorId);
    }

    static getSubscriptionNonParticipants(actionId, subscriptionId) {
        return new actionSDK.GetActionSubscriptionNonParticipants.Request(actionId, subscriptionId);
    }

    static setAttachmentPreview(request, questionName, filesAmount, $img_thumbnail, $col_3, type) {
        actionSDK.executeApi(request)
            .then(function(response) {
                if (type == 'photo') {
                    $img_thumbnail.append(`<img class="image-sec" id="${questionName}" src="${response.attachmentInfo.downloadUrl}"></img>`);
                    if (filesAmount > 1) {
                        $img_thumbnail.append(`<span class="file-counter"> +${filesAmount - 1} </span>`);
                    }
                    $col_3.append($img_thumbnail);
                } else if (type == 'document') {
                    $img_thumbnail.append(`<img class="image-sec" id="${questionName}" src="images/doc.png"></img>`);
                    if (filesAmount > 1) {
                        $img_thumbnail.append(`<span class="file-counter"> +${filesAmount - 1} </span>`);
                    }
                    $col_3.append($img_thumbnail);
                } else if (type == 'video') {
                    $img_thumbnail.append(`<div class="embed-responsive embed-responsive-4by3"><video controls="" class="video" id="${questionName}" src="${response.attachmentInfo.downloadUrl}"></video></div>`);
                    $col_3.append($img_thumbnail);
                }
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error: " + JSON.stringify(error));
            });
    }

    static executeBatchApi(batchRequest) {
        return actionSDK.executeBatchApi(batchRequest);
    }

    static addDataRow(data) {
        return new actionSDK.AddActionDataRow.Request(data);
    }

    static closeView() {
        return new actionSDK.CloseView.Request();
    }

    static getColumnType(type) {
        if (type == 'multiselect') {
            return actionSDK.ActionDataColumnValueType.MultiOption;
        } else if (type == 'singleselect') {
            return actionSDK.ActionDataColumnValueType.SingleOption;
        } else if (type == 'largetext') {
            return actionSDK.ActionDataColumnValueType.LargeText
        }
    }

    static visibility() {
        return actionSDK.Visibility.All;
    }

    static createAction(action) {
        return new actionSDK.CreateAction.Request(action);
    }
}
Localizer.jsonObject = {};
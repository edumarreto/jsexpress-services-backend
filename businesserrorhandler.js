module.exports = app => {

    const em = app.libs.errormessages;

    //Bad BigO complexity - O(n²) - however the object size is small
    return {
        translate: (language, errorCode, defaultMessage) => {
            var returnMessage = defaultMessage;
            for (var i = 0; i < em.Errors.Messages.length; i++) {
                if (errorCode == em.Errors.Messages[i].errorCode) {
                    for (var j = 0; j < em.Errors.Messages[i].message.length; j++) {
                        if (language == em.Errors.Messages[i].message[j].language) {
                            returnMessage = em.Errors.Messages[i].message[j].message;
                            break;
                        }
                    }
                    break;

                }
            }
            return returnMessage;
        }
    }
};
let isReplyOn = 1;
let replyMessage;
let isWindowBlur = false;
document.onkeyup = (e) => {
    if (e.ctrlKey && e.key === "Delete") $("#clear-history-button").click();
};

$("textarea[name=message]")[0].onkeyup = (e) => {
    /* check ctrl + enter */
    if (e.ctrlKey && e.key === "Enter") {
        $("#send-message").click();
        return;
    }

    /* auto row for textarea */
    const textarea = $("textarea[name=message]")[0];
    let row = textarea.value.split("\n").length;
    if (row > 5) row = 5;
    textarea.setAttribute("rows", row.toString());
};

/* functions */

/* clears all messages */
function clearHistory() {
    $("#main")[0].innerHTML = "";
}

/* scrolls to the end */
function scrollToEnd() {
    const mainWrapper = $("#main-wrapper");
    mainWrapper.scrollTop(mainWrapper[0].scrollHeight);
}

/* send message */
function sendMessage(name, connection) {
    let textarea = $("textarea[name=message]")[0];

    if (textarea.value.trim() === "") {
        textarea.value = "";
        textarea.focus();
        textarea.setAttribute("rows", "1");
        return;
    }

    /* send the message here */
    let message = textarea.value.trim().replaceAll("\n", "<br />");
    /* your code here ... */

    if (isReplyOn === 2) {
        if (document.getElementById("ids").value !== "everyone") {

            connection.invoke("SnedReplyMessage_pv", document.getElementById("ids").value, name, message, replyMessage.replyMessageAuthor, replyMessage.replyMessage);
        }
        else {
            connection.invoke("SnedReplyMessage", name, message, replyMessage.replyMessageAuthor, replyMessage.replyMessage).catch(function () {
                console.log("connection lost");

                setTimeout(2000, function () {
                    new signalR.HubConnectionBuilder().withUrl("/chat").build();
                });
            });
        }
    }
    else if (isReplyOn === 1) {

        if (document.getElementById("ids").value !== "everyone") {
            connection.invoke("SendMessage_pv", document.getElementById("ids").value, name, message).catch(function () {
                console.log("connection lost");

                setTimeout(2000, function () {
                    new signalR.HubConnectionBuilder().withUrl("/chat").build();
                });
            });
        }
        else {
            connection.invoke("SendMessage", name, message).catch(function (e) {
                console.log("connection lost");
                console.log(e);

                setTimeout(2000, function () {
                    connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
                });
            });
        }
    }
    else if (isReplyOn == 3) {
        //string stickerUri, string name, string message, string authorReplyMessage, string replyMessage
        if (document.getElementById("ids").value !== "everyone") {
            connection.invoke("SnedReplyMessageToSticker_pv", document.getElementById("ids").value, replyMessage.replyStickerUri, name, message, replyMessage.replyMessageAuthor).catch(function () {
                console.log("connection lost");

                setTimeout(2000, function () {
                    new signalR.HubConnectionBuilder().withUrl("/chat").build();
                });
            });
        }
        else {
            connection.invoke("SnedReplyMessageToSticker",replyMessage.replyStickerUri, name, message, replyMessage.replyMessageAuthor).catch(function (e) {
                console.log("connection lost");
                console.log(e);

                setTimeout(2000, function () {
                    connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
                });
            });
        }
    }


    /* up to here */

    textarea.value = "";
    textarea.placeholder = "پیامی بنویسید ...";
    textarea.focus();
    textarea.setAttribute("rows", "1");
}
/* open / close sticker box */
function OCStickerBox() {
    const stickerBox = $("#sticker-picker-wrapper")[0];

    if (stickerBox.style.display === "block") stickerBox.style.display = "none"; else stickerBox.style.display = "block";
}

/* send sticker */
function sendSticker(stickergroup, stickername) {
    // put your codes here
    // your codes ...
    // number : the number of sticker => 1.png, 2.png, ...
    // up to here
    if (isReplyOn === 2) {

        connection.invoke("SnedReplySticker", stickergroup, stickername.toString(), name, replyMessage.replyMessageAuthor, replyMessage.replyMessage).catch(function () {
            console.log("connection lost");
            setTimeout(2000, function () {
                connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
            });
        });
    }
    else if (isReplyOn === 1) {
        connection.invoke("SendSticker", stickergroup, stickername.toString(), name).catch(function () {
            console.log("connection lost");
            setTimeout(2000, function () {
                connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
            });
        });
    }
    OCStickerBox();
}

/* delete this message */
function delCurrMessage(elem) {
    elem.parentElement.parentElement.remove();
}

/* edit this message */
function editCurrMessage() {

}

/* reply to this message */
function replyCurrMessage(elem) {
    isReplyOn = 2;
    let newPH;
    try {
        newPH = elem.parentElement.parentElement.getElementsByClassName("author")[0].innerHTML;
    } catch (e) {
        newPH = "خودتان";
    }
    replyMessage = {
        replyMessageAuthor: newPH,
        replyMessage: elem.parentElement.parentElement.getElementsByClassName("normalmsg")[0].innerHTML
    };

    $("textarea[name=message]")[0].focus();
    $("textarea[name=message]").attr("placeholder", "پاسخ به " + newPH + " ...");
}
window.blur = () => {
    isWindowBlur = true;
};

function replyCurrSticker(elem) {
    
    isReplyOn = 3;
    let newPH;
    try {
        newPH = elem.parentElement.parentElement.getElementsByClassName("author")[0].innerHTML;
    } catch (e) {
        newPH = "خودتان";
    }
    replyMessage = {
        replyMessageAuthor: newPH,
        replyStickerUri: elem.parentElement.parentElement.getElementsByClassName("sticker")[0].src.toString()
    };
    $("textarea[name=message]")[0].focus();
    $("textarea[name=message]").attr("placeholder", "پاسخ به " + newPH + " ...");

}
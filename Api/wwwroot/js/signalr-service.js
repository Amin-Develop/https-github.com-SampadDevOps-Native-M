var name = prompt("نام را وارد کنید");
var connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();

async function notify() {
    var audio = new Audio('/sounds/message_tone (online-audio-converter.com).wav');
    audio.play();
}


connection.start().then(function () {
    $("#send-message").click(function () {
        sendMessage(name, connection);
    })
});


connection.on("ReceiveMessage", function (pname, pmessage) {
    ReceiveMessage(name, pname, pmessage);
    scrollToEnd();
})
connection.on("ReceiveSticker", function (stickergroup, stickername, pname) {

    ReceiveSticker(stickergroup, name, pname, stickername);
    scrollToEnd();
});
connection.on("ReceiveReplyMessage", function (name, message, authorReplyMessage, replyMessage) {
    console.log("pvreplyes");
    ReceiveReplyMessage(name, message, authorReplyMessage, replyMessage);
    scrollToEnd();
});
connection.on("ReceiveReplySticker", function (stickergroup, stickername, name, message, authorReplyMessage) {
    ReceiveReplySticker(stickergroup, stickername, name, message, authorReplyMessage);
    scrollToEnd();
});
connection.on("UserConnected", function (connectionIds) {
    if (connectionIds.length !== 1) {
        let allClients = document.getElementById("ids");
        allClients.innerHTML = "<option value = 'everyone' >همه</option>";
        for (var connectionid of connectionIds) {

            allClients.innerHTML += "<option value = '" + connectionid + "'>" + connectionid + "</option>";
        }
    }

});


connection.on("ReceiveReplyMessageToSticker", function (stickerUri, name, message, authorReplyMessage) {
    ReceiveReplyMessageToSticker(stickerUri, name, message, authorReplyMessage);
    scrollToEnd();
});
connection.on("UserDisconnected", function (connectionIds) {
    console.log("someone disconnected...");
    if (connectionIds.length !== 1) {
        let allClients = document.getElementById("ids");
        allClients.innerHTML = "<option value = 'everyone' >همه</option>";
        for (var connectionid of connectionIds) {

            allClients.innerHTML += "<option value = '" + connectionid + "'>" + connectionid + "</option>";
        }
    }

});








function ReceiveMessage(name, pname, pmessage) {

    let NOW_TIME = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    if (name === pname) {

        $("#main").append("<div class='chat-message this-user'><p id='message'>" + pmessage + "</p><div class='time'>" + NOW_TIME + "</div></div>");
    }

    else {
        if (!isWindowBlur) {
            notify();
        }
        $("#main").append("<div class='chat-message'><div class='tools'><button class= 'font-icon no-outline hover-bg-difference' onclick = 'delCurrMessage(this)' >&#xE74D;</button ><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div ><div class = 'author'>" + pname + "</div><p id='message'><div class='normalmsg'>" + pmessage + "</div></p><div class='time'>" + NOW_TIME + "</div></div>");

    }
}



function ReceiveSticker(stickergroup, name, pname, stickername) {
    let NOW_TIME = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (pname == name) {
        $("#main").append("<div class='chat-message this-user'> <img src=/stickers/" + stickergroup + "/" + stickername + " alt='sticker' class='sticker'/> <div class='time'> " + NOW_TIME + " </div> </div>");
    }
    else {
        if (!isWindowBlur) {
            notify();
        }
        $("#main").append("<div class='chat-message'> <div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrSticker(this)'>&#xE97A;</button></div> <div class='author'>" + pname + "</div> <img src=/stickers/" + stickergroup + "/" + stickername + " alt='sticker' class='sticker'> <div class='time'>" + NOW_TIME + "</div> </div>");
    }
}


function ReceiveReplyMessage(pname, pmessage, authorReplyMessage, replyMessage) {

    let NOW_TIME = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    if (name === pname) {

        $("#main").append("<div class='chat-message this-user'><div class='reply'><div class= 'author' > " + authorReplyMessage + "</div><div class='message'>" + replyMessage + "</div></div>" + pmessage + "<div class='time'>" + NOW_TIME + "</div></div>");
    }

    else {
        if (!isWindowBlur) {
            notify();
        }
        $("#main").append("<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div class='message'>" + replyMessage + "</div></div><div class ='normalmsg'>" + pmessage + "</div><div class='time'>" + NOW_TIME + "</div></div>");
    }
    isReplyOn = 1;
}

function ReceiveReplySticker(stickergroup, stickername, pname, authorReplyMessage, replyMessage) {

    let NOW_TIME = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    if (pname === this.name) {

        $("#main").append("<div class='chat-message this-user'><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div>" + replyMessage + "</div></div><img src='/stickers/" + stickergroup + "/" + stickername + "' alt='sticker' class='sticker'><div class='time'>" + NOW_TIME + "</div></div>");
    }

    else {
        if (!isWindowBlur) {
            notify();
        }
        $("#main").append("<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div>" + replyMessage + "</div></div><img src='/stickers/" + stickergroup + "/" + stickername + "' alt='sticker' class='sticker'><div class='time'>" + NOW_TIME + "</div></div>");
    }
    isReplyOn = 1;
}

function ReceiveReplyMessageToSticker(stickerUri, pname, message, authorReplyMessage) {

    let NOW_TIME = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    if (pname === this.name) {

        $("#main").append("<div class='chat-message this-user'><div class='reply'><div class='author'>" + authorReplyMessage + "</div><img src='" + stickerUri + "' alt='sticker' class='sticker'></div>" + message + "<div class='time'>" + NOW_TIME + "</div></div>");
    }

    else {
        if (!isWindowBlur) {
            notify();
        }
        $("#main").append("<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><img src='" + stickerUri + "' alt='sticker' class='sticker'></div>" + message + "<div class='time'>" + NOW_TIME + "</div></div>");
    }
    isReplyOn = 1;
}
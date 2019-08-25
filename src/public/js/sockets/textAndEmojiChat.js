function textAndEmojiChat(divId) {
    $('.emojionearea').unbind('keyup').on("keyup", function (element) {
        const currentEmojiArea = $(this);
        if (element.which === 13) {
            const targetId = $(`#write-chat-${divId}`).data("chat");
            const messageVal = $(`#write-chat-${divId}`).val();
            if (!targetId.length || !messageVal.length) {
                return false;
            }
            const dataTextEmojiForSend = {
                uid: targetId,
                messageVal: messageVal
            }
            if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
                dataTextEmojiForSend.isChatGroup = true;
            }
            $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
                const dataToEmit = {
                    message: data.message
                };
                const messageOfMe = $(`<div class="convert-emoji bubble me" data-mess-id="${data.message._id}" ></div>`);
                messageOfMe.text(data.message.text);
                let converEmojiMessage = emojione.toImage(messageOfMe.html());//Khi đẩy tin nhắn vào list chat thì gọi hàm Image để nếu có dữ liệu thì conver sang emoji
                if (dataTextEmojiForSend.isChatGroup) {
                    const src = (data.message.sender.avatar === null) ? 'images/users/no-avatar.png' : `/images/users/${data.message.sender.avatar}`
                    const senderAvatar = `<img class="avatar-small" src=${src} title="${data.message.sender.name}">`;
                    messageOfMe.html(`${senderAvatar} ${converEmojiMessage}`);
                    increaseNumberMessageGroup(divId);//Tăng số lượng tin nhắn
                    dataToEmit.groupId = targetId;
                }
                else {
                    messageOfMe.html(converEmojiMessage);//Sau khi conver thì lại đẩy vào div
                    dataToEmit.contactId = targetId;
                };


                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);//đẩy tin nhắn mới vào cuối danh sách
                nineScrollRight(divId);//tự động cuộn trang xuống dưới mỗi khi gửi tin nhắn
                $(`#write-chat-${divId}`).val("");
                currentEmojiArea.find(".emojionearea-editor").text("");
                
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf('seconds').fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));
                // 
                $(`.person[data-chat=${divId}]`).on("typing.moveConverstationToTheTop", function () {
                    const dataMove = $(this).parent();
                    $(this).closest("ul").prepend(dataMove);
                    $(this).off("typing.moveConverstationToTheTop");
                });
                $(`.person[data-chat=${divId}]`).trigger("typing.moveConverstationToTheTop");
                socket.emit("chat-text-emoji", dataToEmit);//bắn sự kiện socket cho group hoặc cá nhân.
                typingOff(divId);
                const checkTyping =   $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
                if(checkTyping.length) checkTyping.remove(); 
            }).fail(function (response) {
                console.log(response);
                alertify.notify(response.statusText, "error", 5);
            });
        }

    });
}
$(document).ready(function () {
    socket.on("response-chat-text-emoji", function (response) {
        //nhận được dữ liệu từ server bắn về
        //Xử lý dữ liệu
        let divId = "";
        const messageOfYou = $(`<div class="convert-emoji bubble you" data-mess-id="${response.message._id}" ></div>`);
        messageOfYou.text(response.message.text);
        let converEmojiMessage = emojione.toImage(messageOfYou.html());//Khi đẩy tin nhắn vào list chat thì gọi hàm Image để nếu có dữ liệu thì conver sang emoji
        if (response.currentGroupId) {
            const src = (response.message.sender.avatar === null) ? '/images/users/no-avatar.png' : `/images/users/${response.message.sender.avatar}`
            const senderAvatar = `<img class="avatar-small" src="${src}" title="${response.message.sender.name}">`;
            messageOfYou.html(`${senderAvatar} ${converEmojiMessage}`);
            divId = response.currentGroupId;
            if (response.currentUserId !== $(`#dropdown-navbar-user`).data("uid")) {
                $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
                  increaseNumberMessageGroup(divId);//Tăng số lượng tin nhắn
            }
        }
        else {
            messageOfYou.html(converEmojiMessage);//Sau khi conver thì lại đẩy vào div
            divId = response.currentUserId;
        };
        //Sau khi xử lý dữ liệu thì hiển thị lên màn hình.
        //Khi server bắn sự kiện về thì phải loại trừ user hiện tại không cần phải append nữa vì đã append lúc bắn sự kiện rồi.
        //bởi vì user hiện tại cũng có socketId nằm trong mảng socketGroupId.
        if (response.currentUserId !== $(`#dropdown-navbar-user`).data("uid")) {
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);//đẩy tin nhắn mới vào cuối danh sách
            nineScrollRight(divId);//tự động cuộn trang xuống dưới mỗi khi gửi tin nhắn
            $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
        }
        //Xử lý phần leftSide và timeStamp;
        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf('seconds').fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));
        //Đẩy cuộc trò chuyện lên đầu leftSide.
        $(`.person[data-chat=${divId}]`).on("typing.moveConverstationToTheTop", function () {
            const dataMove = $(this).parent();
            $(this).closest("ul").prepend(dataMove);
            $(this).off("typing.moveConverstationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("typing.moveConverstationToTheTop");
    })
});
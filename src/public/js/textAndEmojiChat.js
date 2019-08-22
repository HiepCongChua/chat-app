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
                const messageOfMe = $(`<div class="convert-emoji bubble me" data-mess-id="${data.message._id}" ></div>`);
                if (dataTextEmojiForSend.isChatGroup) {
                    const src = (data.message.sender.avatar===null) ? 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png' : `/images/users/${data.message.sender.avatar}`
                    messageOfMe.html(`<img class="avatar-small" src="${src}" title="${data.message.sender.name}">`);
                    messageOfMe.text(data.message.text);
                    increaseNumberMessageGroup(divId)
                }
                else {
                    messageOfMe.text(data.message.text);
                }
                 let converEmojiMessage = emojione.toImage(messageOfMe.html());//Khi đẩy tin nhắn vào list chat thì gọi hàm Image để nếu có dữ liệu thì conver sang emoji
                messageOfMe.html(converEmojiMessage);//Sau khi conver thì lại đẩy vào div
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);//đẩy tin nhắn mới vào cuối danh sách
                nineScrollRight(divId);//tự động cuộn trang xuống dưới mỗi khi gửi tin nhắn
                $(`#write-chat-${divId}`).val("");
                currentEmojiArea.find(".emojionearea-editor").text("");
                $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf('seconds').fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));
                $(`.person[data-chat=${divId}]`).on("click.moveConverstationToTheTop",function(){
                 const dataMove = $(this).parent();
                 $(this).closest("ul").prepend(dataMove);
                 $(this).off("click.moveConverstationToTheTop");
                });
                $(`.person[data-chat=${divId}]`).click();
            }).fail(function (response) {
                console.log(response);
                alertify.notify(response.responseText, "error", 5);
            });
        }

    });
}
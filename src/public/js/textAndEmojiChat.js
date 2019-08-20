function textAndEmojiChat(divId) {
    $('.emojionearea').unbind('keyup').on("keyup", function (element) {
        if (element.which === 13) {
                const targetId = $(`#write-chat-${divId}`).data("chat");
             const messageVal = $(`#write-chat-${divId}`).val();
            if(!targetId.length || !messageVal.length)
            {
                 return false;
            }
            const dataTextEmojiForSend = {
                uid:targetId,
                messageVal:messageVal
            }
            if($(`#write-chat-${divId}`).hasClass('chat-in-group')){
                dataTextEmojiForSend.isChatGroup = true;
            }
            $.post("/message/add-new-text-emoji",dataTextEmojiForSend,function(data){
              console.log(data.message);
            }).fail(function(response){
              console.log(response);
            alertify.notify(response.responseText,"error",5);
            });
        }

    });
}
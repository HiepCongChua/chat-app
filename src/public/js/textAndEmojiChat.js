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
            console.log(dataTextEmojiForSend);
            $.post("/message/add-new-text-emoji",dataTextEmojiForSend,function(){
              
            }).fail(function(response){

            });
        }

    });
}
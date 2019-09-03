function readMoreMessage(){
 $(".right .chat").unbind('scroll').on('scroll',function(){
   if($(this).scrollTop()===0){
       const firstMessage = $(this).find('.bubble:first');
       const currentOffset = firstMessage.offset().top - $(this).scrollTop();
       const messageLoading = `<img src='images/chat/loading-message.gif' class='message-loading'>`;
       $(this).prepend(messageLoading);
       const targetId = $(this).data("chat");
       const skipMessage = $(this).find("div.bubble").length;
       const chatInGroup = $(this).hasClass("chat-in-group");
       const self = $(this);
       $.get(`/message/read-more-message?skipMessage=${skipMessage}&chatInGroup=${chatInGroup}&targetId=${targetId}`,function(data){
        if(data.rightSideData.trim()===''){
            alertify.notify("Bạn không còn tin nhắn nào trong cuộc trò chuyện.","error",5);  
            self.find("img.message-loading").remove();
            return false;
        };
        $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);
        $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);
        convertEmoji();
        $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);
        gridPhotos(5);
        $(`#attachmentsModal_${targetId}`).find(`ul.list-attachments`).append(data.attachmentModalData);
        self.find("img.message-loading").remove();
       });
   };
 });
}
$(document).ready(function(){
  readMoreMessage();
});
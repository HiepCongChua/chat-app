function typingOn(divId) {
  console.log("This is divId",divId);
    const targetId = $(`#write-chat-${divId}`).data("chat");
    console.log("This is tartgetId",targetId);
    if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
        socket.emit("user-typing", { groupId: targetId });
    } else {
        socket.emit("user-typing", { contactId: targetId });
    }
}
function typingOff(divId) {
  const targetId = $(`#write-chat-${divId}`).data("chat");
  if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
      socket.emit("user-not-typing", { groupId: targetId });
  } else {
      socket.emit("user-not-typing", { contactId: targetId });
  }
}
$(document).ready(function(){
  socket.on("response-user-typing",function(response){
     const messageTyping = `<div class="bubble you bubble-typing-gif">
      <img src="/images/chat/typing.gif">
     </div>`;
     if(response.currentGroupId){
       if(response.currentUserId !== $(`#dropdown-navbar-user`).data("uid")){
              const flag =   ($(`.chat[data-chat=${response.currentGroupId}]`).find("div.bubble-typing-gif").length) === 0 ;
              if(!flag) return false; 
              $(`.chat[data-chat=${response.currentGroupId}]`).append(messageTyping);
              nineScrollRight(response.currentGroupId);//tự động cuộn trang xuống dưới mỗi khi gửi tin nhắn
       }
     } else {
        const flag =   ($(`.chat[data-chat=${response.currentUserId}]`).find("div.bubble-typing-gif").length) === 0 ;
        if(!flag) return false; 
        $(`.chat[data-chat=${response.currentUserId}]`).append(messageTyping);
        nineScrollRight(response.currentUserId);//tự động cuộn trang xuống dưới mỗi khi gửi tin nhắn
     }
  });
  socket.on("response-user-not-typing",function(response){
    const messageTyping = `<div class="bubble you bubble-typing-gif">
     <img src="/images/chat/typing.gif">
    </div>`; 
    if(response.currentGroupId){
      if(response.currentUserId !== $(`#dropdown-navbar-user`).data("uid")){
        $(`.chat[data-chat=${response.currentGroupId}]`).find("div.bubble-typing-gif").remove();
        nineScrollRight(response.currentGroupId);
      }
    } else {
       $(`.chat[data-chat=${response.currentUserId}]`).find("div.bubble-typing-gif").remove();
       nineScrollRight(response.currentUserId);//tự động cuộn trang xuống dưới mỗi khi gửi tin nhắn
    }
 });
});

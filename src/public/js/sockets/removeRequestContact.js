function removeRequestContact(){
    $('.user-remove-request-contact').bind('click',function(){
    let targetId = $(this).data('uid');
     $.ajax({
         url:'contact/remove-request-contact',
         type:'DELETE',
         data:{uid:targetId},
         success:function(data){
             if(data.success)
             {
            $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display","inline-block");
            $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide(); 
            decreaseNumberNotifiContact('count-request-contact-sent'); 
            //Socket emit remove contact
            socket.emit("remove-request-contact", {
                //Khi addContact thì bắn một sự kiện lên server
                contactId: targetId
            });
             }
         }
     });
    });
};
socket.on("response-remove-request-contact", user => {//Mỗi khi A gửi yêu cầu rồi lại hủy thì ẩn yêu cầu đi
    $('.noti_content').find(`div[data-uid = ${user.id}]`).remove();
    $('ul.list-notifications').find(`li>div[data-uid=${user.id}]`).parent().remove();//đẩy vào modal
    decreaseNumberNotifiContact('count-request-contact-received');
    decreaseNumberNotification('noti_contact_counter');
    decreaseNumberNotification('noti_counter');
});
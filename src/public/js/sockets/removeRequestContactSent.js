function removeRequestContactSent(){
    $('.user-remove-request-contact-sent').unbind('click').on('click',function(){
    let targetId = $(this).data('uid');
     $.ajax({
         url:'/contact/remove-request-contact-sent',
         type:'DELETE',
         data:{uid:targetId},
         success:function(data){
             if(data.success)
             {
            $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display","inline-block");
            $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).hide(); 
            decreaseNumberNotifiContact('count-request-contact-sent'); 
            decreaseNumberNotification('noti_contact_counter',1);
            $("#request-contact-sent").find(`li[data-uid=${targetId}]`).remove();
            //Socket emit remove contact
            socket.emit("remove-request-contact-sent", {
                //Khi addContact thì bắn một sự kiện lên server
                contactId: targetId
            });
             };
         }
     });
    });
};
socket.on("response-remove-request-contact-sent", user => {//Mỗi khi A gửi yêu cầu rồi lại hủy thì ẩn yêu cầu đi
    $('.noti_content').find(`div[data-uid = ${user.id}]`).remove();
    $('ul.list-notifications').find(`li>div[data-uid=${user.id}]`).parent().remove();//đẩy vào modal
    decreaseNumberNotifiContact('count-request-contact-received');
    decreaseNumberNotification('noti_contact_counter',1);
    decreaseNumberNotification('noti_counter',1);
    $('#request-contact-received').find(`li[data-uid=${user.id}]`).remove();
    let img = '';
  if (!user.avatar) {
    img = `<img class="avatar-small" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png">`
  }
  else {
    img = `<img class="avatar-small" src="images/users/${user.avatar}" alt="">`
  }
    const userInfo = `
    <li class="_contactList" data-uid="${user.id}">
    <div class="contactPanel">
        <div class="user-avatar">${img}</div>
        <div class="user-name">
            <p>
                ${user.username}
            </p>
        </div>
        <br/>
        <div class="user-address">
            <span>&nbsp; ${user.address||''}</span>
        </div>

        <div class="user-add-new-contact" data-uid="${user.id}">
            Thêm vào danh sách liên lạc
        </div>

        <div class="user-remove-request-contact-sent action-danger" data-uid="${user.id}">
            Hủy yêu cầu
        </div>

    </div>
</li>
    `
    $('#find-user').find("ul").append(userInfo);
});
$(document).ready(function(){
   removeRequestContactSent();
});
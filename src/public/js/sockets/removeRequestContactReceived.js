function removeRequestContactReceived() {
    $('.user-remove-request-contact-received').unbind('click').on('click', function () {
        let targetId = $(this).data('uid');
        $.ajax({
            url: 'contact/remove-request-contact-received',
            type: 'DELETE',
            data: { uid: targetId },
            success: function (data) {
                if (data.success) {
                    // $('.noti_content').find(`div[data-uid = ${user.id}]`).remove();
                    // $('ul.list-notifications').find(`li>div[data-uid=${user.id}]`).parent().remove();
                    // decreaseNumberNotification('noti_counter', 1);
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                    $("#find-user").find(`div.user-remove-request-contact-received[data-uid = ${targetId}]`).hide();
                    decreaseNumberNotifiContact('count-request-contact-received');
                    decreaseNumberNotification('noti_contact_counter', 1);
                    $("#request-contact-sent").find(`li[data-uid=${targetId}]`).remove();
                    //Socket emit remove contact
                    $('#request-contact-received').find(`li[data-uid=${targetId}]`).remove();
                    socket.emit("remove-request-contact-received", {
                        //Khi addContact thì bắn một sự kiện lên ser 
                        contactId: targetId
                    });
                };
            }
        });
    });
};
socket.on("response-remove-request-contact-received", user => { 
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");
    $("#find-user").find(`div.user-remove-request-contact-received[data-uid = ${user.id}]`).hide();
    $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();
    decreaseNumberNotifiContact('count-request-contact-sent');
    decreaseNumberNotification('noti_contact_counter', 1);
    
});
$(document).ready(function () {
    removeRequestContactReceived();
}); 
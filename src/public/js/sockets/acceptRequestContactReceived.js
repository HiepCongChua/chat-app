function acceptRequestContactReceived() {
  $(".user-accept-contact-received")
    .unbind("click")
    .on("click", function() {
      let targetId = $(this).data("uid");
      const userInfo = $("#request-contact-received").find(
        `ul li[data-uid=${{ targetId }}]`
      );
      $(userInfo)
        .find("div.user-accept-contact-received")
        .remove();
      $(userInfo)
        .find("div.user-remove-request-contact-received")
        .remove();
      $(userInfo).find("div.contactPanel").append(`
        <div class="user-talk" data-uid="${targetId}">
        Trò chuyện
      </div>
      <div class="user-remove-contact action-danger" data-uid="${targetId}">
        Xóa liên hệ
      </div>
        `);
      // $.ajax({
      //     url: 'contact/accept-request-contact-received',
      //     type: 'PUT',
      //     data: { uid: targetId },
      //     success: function (data) {
      //         if (data.success) {
      //             socket.emit("accept-request-contact-received", {contactId: targetId});
      //         };
      //     }
      // });
    });
}
socket.on("response-accept-request-contact-received", user => {
  $("#find-user")
    .find(`div.user-add-new-contact[data-uid = ${user.id}]`)
    .css("display", "inline-block");
  $("#find-user")
    .find(`div.user-remove-request-contact-received[data-uid = ${user.id}]`)
    .hide();
  $("#request-contact-sent")
    .find(`li[data-uid=${user.id}]`)
    .remove();
  decreaseNumberNotifiContact("count-request-contact-sent");
  decreaseNumberNotification("noti_contact_counter", 1);
});
$(document).ready(function() {
  removeRequestContactReceived();
});

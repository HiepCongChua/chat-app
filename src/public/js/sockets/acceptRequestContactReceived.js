function acceptRequestContactReceived() {//Khi chúng ta chấp nhận yêu cầu kết bạn
  $(".user-accept-contact-received")
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("uid");
      $.ajax({
        url: '/contact/accept-request-contact-received',
        type: 'PUT',
        data: { uid: targetId },
        success: function (data) {
          if (data.success) {
            const userInfo = $("#request-contact-received").find(//Lấy ra thẻ li
              `ul li[data-uid=${targetId}]`
            );
            $(userInfo)
              .find("div.user-accept-contact-received")
              .remove();
            $(userInfo)
              .find("div.user-remove-request-contact-received ")
              .remove();
            $(userInfo).find("div.contactPanel").append(`
                  <div class="user-talk" data-uid="${targetId}">
                  Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${targetId}">
                  Xóa liên hệ
                </div>
                  `);
            const userInfoHtml = userInfo.get(0).outerHTML;
            $("#contacts").find("ul").prepend(userInfoHtml);
            userInfo.remove();
            removeContact();
            decreaseNumberNotifiContact('count-request-contact-received');//Sau khi đồng ý yêu cầu kết bạn thì trừ đi số lượng yêu cầu kết bạn đi 1
            increaseNumberNotifiContact('count-contacts');
            decreaseNumberNotification('noti_contact_counter', 1);
            socket.emit("accept-request-contact-received", { contactId: targetId });
          };
        }
      });
    });
};
socket.on("response-accept-request-contact-received", user => {//Khi chúng ta được một người khác đồng ý yêu cầu kết bạn.
  let img = '';
  if (!user.avatar) {
    img = `<img class="avatar-small" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png">`
  }
  else {
    img = `<img class="avatar-small" src="images/users/${user.avatar}" alt="">`
  }
  const notifi = `
  <div class="notif-readed-false" data-uid="${user.id}">
  ${img}
  <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn !
</div>
    `;
  $('.noti_content').prepend(notifi);//Khi nhận được sự kiện add thì tự động đẩy từ trên xuống dưới(thằng mới nhất sẽ lên trên cùng)
  $('ul.list-notifications').prepend(`<li>${notifi}</li>`);//đẩy vào modal
  $("#find-user").find(`ul li[data-uid=${user.id}]`).remove();
  decreaseNumberNotification('noti_contact_counter', 1);
  increaseNumberNotification('noti_counter', 1);

  decreaseNumberNotifiContact('count-request-contact-sent');//giảm
  //Sau khi đồng ý yêu cầu kết bạn thì trừ đi số lượng yêu cầu kết bạn đi 1
  increaseNumberNotifiContact('count-contacts');//tăng
  $("#request-contact-sent").find(`ul li[data-uid=${user.id}]`).remove();
  $("#find-user").find(`ul li[data-uid=${user.id}]`).remove();
  const userInfoHtml = `
    <li class="_contactList" data-uid="${user.id}">
    <div class="contactPanel">
      <div class="user-avatar">${img}</div>
                  <div class="user-name">
                    <p>
                      ${user.username}
                    </p>
                  </div>
                  <br />
                  <div class=" user-address">
        <span>&nbsp; ${user.address || ''} </span>
      </div>
      <div class="user-talk" data-uid="${user.id}">
        Trò chuyện
      </div>
      <div class="user-remove-contact action-danger" data-uid="${user.id}">
        Xóa liên hệ
      </div>
    </div>
  </li>
    `;
  $("#contacts").find("ul").prepend(userInfoHtml);
  removeContact();
});

$(document).ready(function () {
  acceptRequestContactReceived();
});

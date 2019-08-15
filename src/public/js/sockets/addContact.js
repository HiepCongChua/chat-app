function addContact() {
  $(".user-add-new-contact").bind("click", function () {
    let targetId = $(this).data("uid");
    $.post("/contact/add-new", { uid: targetId }, function (data) {
      if (data.success) {
        // /Xủ lý 2 nút button
        $("#find-user")
          .find(`div.user-add-new-contact[data-uid = ${targetId}]`)
          .hide();
        $("#find-user")
          .find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`)
          .css("display", "inline-block");
        increaseNumberNotification('noti_contact_counter', 1);//Tính toán số lượng thông báo
        //Khi nhấn thêm mới thì đồng thời tăng giá trị trên màn hình.
        increaseNumberNotifiContact("count-request-contact-sent");//Tính toán số lượng liên lạc
        const userInfoHtml = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML;//Sau khi chúng ta gửi yêu cầu kết bạn
        //thì khối info của user mà chúng ta vừa gửi lời mời kết bạn ở bên find user để append lập tức vào bên request contact sent
        $("#request-contact-sent").find("ul").prepend(userInfoHtml);
        removeRequestContactSent();
        socket.emit("add-new-contact", {
          //Khi addContact thì bắn một sự kiện lên server
          contactId: targetId
        });
      };
    });
  });
};
socket.on("response-add-new-contact", user => {//Mỗi khi nhận được yêu cầu thêm liên lạc mới thì ô thông báo tự động đẩy ra div
  let img = ''
  if (!user.avatar) {
    img = `<img class="avatar-small" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png">`
  }
  else {
    img = `<img class="avatar-small" src="images/users/${user.avatar}" alt="">`
  }
  const notifi = `
  <div class="notif-readed-false" data-uid="${user.id}">
  ${img}
  <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
</div>
    `;
  $('.noti_content').prepend(notifi);//Khi nhận được sự kiện add thì tự động đẩy từ trên xuống dưới(thằng mới nhất sẽ lên trên cùng)
  $('ul.list-notifications').prepend(`<li>${notifi}</li>`);//đẩy vào modal
  increaseNumberNotifiContact('count-request-contact-received', 1);
  increaseNumberNotification('noti_contact_counter', 1);
  increaseNumberNotification('noti_counter', 1);
  $("#find-user").find(`ul li[data-uid=${user.id}]`).remove();
  const userInfoHtml = `
    <li style="text-decoration: none" class="_contactList" data-uid="${user.id}">
    <div class="contactPanel">
      <div class="user-avatar">${img}</div>
            <div class="user-name">
              <p>
                 ${user.username}
              </p>
            </div>
            <br />

            <div class=" user-address">
        <span>&nbsp ${user.address} </span>
      </div>
      <div class="user-accept-contact-received" data-uid="${user.id}">
        Chấp nhận
      </div>
      <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
        Xóa yêu cầu
      </div>
    </div>
  </li>
    `
  $('#request-contact-received').find("ul").prepend(userInfoHtml);
  removeRequestContactReceived();
  acceptRequestContactReceived();
});

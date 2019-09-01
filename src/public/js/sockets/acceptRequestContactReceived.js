function acceptRequestContactReceived() {
  //Khi chúng ta chấp nhận yêu cầu kết bạn
  $(".user-accept-contact-received")
    .unbind("click")
    .on("click", function () {
      const targetId = $(this).data("uid");
      const targetName = $(this)
        .parent()
        .find("div.user-name>p")
        .text()
        .trim();
      const targetAvatar = $(this)
        .parent()
        .find("div.user-avatar>img")
        .attr("src");
      $.ajax({
        url: "/contact/accept-request-contact-received",
        type: "PUT",
        data: { uid: targetId },
        success: function (data) {
          if (data.success) {
            const userInfo = $("#request-contact-received").find(
              //Lấy ra thẻ li
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
            $("#contacts")
              .find("ul")
              .prepend(userInfoHtml);
            userInfo.remove();
            removeContact();
            decreaseNumberNotifiContact("count-request-contact-received"); //Sau khi đồng ý yêu cầu kết bạn thì trừ đi số lượng yêu cầu kết bạn đi 1
            increaseNumberNotifiContact("count-contacts");
            decreaseNumberNotification("noti_contact_counter", 1);
            socket.emit("accept-request-contact-received", {
              contactId: targetId
            });

            //Khi đồng ý yêu cầu kết bạn thì đẩy info user vào leftSide
            $("#contactsModal").modal("hide");
            let subUserName = targetName;
            const src = ``;
            if (subUserName.length > 15) {
              subUserName = subUserName.substr(0, 14) + "<span>...</span>";
            }
            const userChatLeftSide = `
            <a href="#uid_${targetId}" class="room-chat" data-target="#to_${targetId}">
            <li class="person" data-chat="${targetId}">
              <div class="left-avatar">
                <div class="dot"></div>
                <img
                src="${targetAvatar}" alt="" 
                />
              </div>
              <span class="name">${subUserName}</span>
              <span class="time"></span>
              <span class="preview  convert-emoji"></span>
            </li>
          </a>     
            `;
            $("#all-chat")
              .find("ul")
              .prepend(userChatLeftSide);
            $("#user-chat")
              .find("ul")
              .prepend(userChatLeftSide);

            const userChatRightSide = `
            <div
        class="right tab-pane"
        data-chat="${targetId}"
        id="to_${targetId}"
      >
        <div class="top">
          <span
            >To: <span class="name">${subUserName}</span></span
          >
          <span class="chat-menu-right">
            <a href="#attachmentsModal_${targetId}" class="show-attachments" data-toggle="modal">
              Tệp đính kèm
              <i class="fa fa-paperclip"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="#imagesModal_${targetId}" class="show-images" data-toggle="modal">
              Hình ảnh
              <i class="fa fa-photo"></i>
            </a>
          </span>
        </div>
        <div class="content-chat">
          <div class="chat" data-chat="${targetId}"></div>
        </div>
        <div class="write"  data-chat="${targetId}">
          <input
            type="text"
            id="write-chat-${targetId}"
            class="write-chat"
            data-chat="${targetId}"
          />
          <div class="icons">
            <a href="#" class="icon-chat" data-chat="${targetId}"
              ><i class="fa fa-smile-o"></i
            ></a>
            <label for="image-chat-${targetId}">
              <input
                type="file"
                id="image-chat-${targetId}"
                name="my-image-chat"
                class="image-chat"
                data-chat="${targetId}"
              />
              <i class="fa fa-photo"></i>
            </label>
            <label for="attachment-chat-${targetId}">
              <input
                type="file"
                id="attachment-chat-${targetId}"
                name="my-attachment-chat"
                class="attachment-chat"
                data-chat="${targetId}"
              />
              <i class="fa fa-paperclip"></i>
            </label>
            <a
            href="javascript:void(0)"
            id="video-chat-${targetId}"
            class="video-chat"
            data-chat="${targetId}"
          >
            <i class="fa fa-video-camera"></i>
          </a>
          </div>
        </div>
      </div>
            `;
            $("#screen-chat").prepend(userChatRightSide);
            changeScreenChat();

            //add imageModal
            const imageModal = `
            <div class="modal fade" id="imagesModal_${targetId}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Hình ảnh trong cuộc trò chuyện</h4>
              </div>
                  <div class="modal-body">
                      <div class="all-images" style="visibility: hidden;"></div>
                  </div>
              </div>
          </div>
      </div>
            `;
            $("body").append(imageModal);
            gridPhotos(5);

            //add attachmentModal
            const attachmentModal = `
            <div class="modal fade" id="attachmentsModal_${targetId}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Tệp đính kèm trong cuộc trò chuyện.</h4>
                </div>
                <div class="modal-body">
                    <ul class="list-attachments"></ul>
                      </div>
                  </div>
              </div>
          </div>
            `
            $("body").append(attachmentModal);
          }
        }
      });
    });
}
socket.on("response-accept-request-contact-received", user => {
  //Khi chúng ta được một người khác đồng ý yêu cầu kết bạn.
  let img = "";
  if (!user.avatar) {
    img = `<img class="avatar-small" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png">`;
  } else {
    img = `<img class="avatar-small" src="images/users/${user.avatar}" alt="">`;
  }
  const notifi = `
  <div class="notif-readed-false" data-uid="${user.id}">
  ${img}
  <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn !
</div>
    `;
  $(".noti_content").prepend(notifi); //Khi nhận được sự kiện add thì tự động đẩy từ trên xuống dưới(thằng mới nhất sẽ lên trên cùng)
  $("ul.list-notifications").prepend(`<li>${notifi}</li>`); //đẩy vào modal
  $("#find-user")
    .find(`ul li[data-uid=${user.id}]`)
    .remove();
  decreaseNumberNotification("noti_contact_counter", 1);
  increaseNumberNotification("noti_counter", 1);

  decreaseNumberNotifiContact("count-request-contact-sent"); //giảm
  //Sau khi đồng ý yêu cầu kết bạn thì trừ đi số lượng yêu cầu kết bạn đi 1
  increaseNumberNotifiContact("count-contacts"); //tăng
  $("#request-contact-sent")
    .find(`ul li[data-uid=${user.id}]`)
    .remove();
  $("#find-user")
    .find(`ul li[data-uid=${user.id}]`)
    .remove();
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
        <span>&nbsp; ${user.address || ""} </span>
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
  $("#contacts")
    .find("ul")
    .prepend(userInfoHtml);
  removeContact();

  // Đứng ở phía người lắng nghe khi được đối phương đồng ý yêu cầu kết bạn thì tự động add info của đối phương vào left side và right side.
  let subUserName = user.username;
  if (subUserName.length > 15) {
    subUserName = subUserName.substr(0, 14) + "<span>...</span>";
  }
  const userChatLeftSide = `
            <a href="#uid_${user.id}" class="room-chat" data-target="#to_${user.id}">
            <li class="person" data-chat="${user.id}">
              <div class="left-avatar">
                <div class="dot"></div>
                ${img}
              </div>
              <span class="name">${subUserName}</span>
              <span class="time"></span>
              <span class="preview  convert-emoji"></span>
            </li>
          </a>     
            `;
  $("#all-chat")
    .find("ul")
    .prepend(userChatLeftSide);
  $("#user-chat")
    .find("ul")
    .prepend(userChatLeftSide);

  const userChatRightSide = `
            <div
        class="right tab-pane"
        data-chat="${user.id}"
        id="to_${user.id}"
      >
        <div class="top">
          <span
            >To: <span class="name">${subUserName}</span></span
          >
          <span class="chat-menu-right">
            <a href="#attachmentsModal_${user.id}" class="show-attachments" data-toggle="modal">
              Tệp đính kèm
              <i class="fa fa-paperclip"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="#imagesModal_${user.id}" class="show-images" data-toggle="modal">
              Hình ảnh
              <i class="fa fa-photo"></i>
            </a>
          </span>
        </div>
        <div class="content-chat">
          <div class="chat" data-chat="${user.id}"></div>
        </div>
        <div class="write"  data-chat="${user.id}">
          <input
            type="text"
            id="write-chat-${user.id}"
            class="write-chat"
            data-chat="${user.id}"
          />
          <div class="icons">
            <a href="#" class="icon-chat" data-chat="${user.id}"
              ><i class="fa fa-smile-o"></i
            ></a>
            <label for="image-chat-${user.id}">
              <input
                type="file"
                id="image-chat-${user.id}"
                name="my-image-chat"
                class="image-chat"
                data-chat="${user.id}"
              />
              <i class="fa fa-photo"></i>
            </label>
            <label for="attachment-chat-${user.id}">
              <input
                type="file"
                id="attachment-chat-${user.id}"
                name="my-attachment-chat"
                class="attachment-chat"
                data-chat="${user.id}"
              />
              <i class="fa fa-paperclip"></i>
            </label>
            <a
            href="javascript:void(0)"
            id="video-chat-${user.id}"
            class="video-chat"
            data-chat="${user.id}"
          >
            <i class="fa fa-video-camera"></i>
          </a>
          </div>
        </div>
      </div>
            `;
  $("#screen-chat").prepend(userChatRightSide);
  changeScreenChat();

  //add imageModal
  const imageModal = `
            <div class="modal fade" id="imagesModal_${user.id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Hình ảnh trong cuộc trò chuyện</h4>
              </div>
                  <div class="modal-body">
                      <div class="all-images" style="visibility: hidden;"></div>
                  </div>
              </div>
          </div>
      </div>
            `;
  $("body").append(imageModal);
  gridPhotos(5);

  //add attachmentModal
  const attachmentModal = `
            <div class="modal fade" id="attachmentsModal_${user.id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Tệp đính kèm trong cuộc trò chuyện.</h4>
                </div>
                <div class="modal-body">
                    <ul class="list-attachments"></ul>
                      </div>
                  </div>
              </div>
          </div>
            `
  $("body").append(attachmentModal);

});

$(document).ready(function () {
  acceptRequestContactReceived();
});

function addFriendsToGroup() {
  $('ul#group-chat-friends').find('div.add-user').bind('click', function () {
    let uid = $(this).data('uid');
    $(this).remove();
    let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();

    let promise = new Promise(function (resolve, reject) {
      $('ul#friends-added').append(html);
      $('#groupChatModal .list-user-added').show();
      resolve(true);
    });
    promise.then(function (success) {
      $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
    });
  });
}
function cancelCreateGroup() {
  $('#btn-cancel-group-chat').bind('click', function () {
    $('#input-name-group-chat').val(null);
    $('#groupChatModal .list-user-added').hide();
    $("#groupChatModal").modal("hide");
    $('#input-search-friends-to-add-group-chat').val(null);
    $('#input-search-friends-to-add-group-chat').val(null);
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function (index) {
        $(this).remove();
      });
    }
  });
}
function searchFriend(e) {
  if (e.which === 13 || e.type === 'click') {
    const keyword = $('#input-search-friends-to-add-group-chat').val();
    const regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if (!keyword.length) {
      alertify.notify("Chưa nhập nội dung tìm kiếm.", "error", 5);
      return false;
    };
    if (!regexKeyword.test(keyword)) {
      alertify.notify("Lỗi từ khóa chỉ cho phép kí tự chữ cái và số, cho phép khoảng trống.", "success", 5);
      return false;
    };
    $.get(`/contact/find-friends/${keyword}`, { keyword }, function (data) {
      $('ul#group-chat-friends').html(data);
      addFriendsToGroup();
      cancelCreateGroup();
    });
  };
};
function createGroupChat() {
  const userId = $(`#dropdown-navbar-user`).data("uid");
  $('#btn-create-group-chat').unbind("click").on("click", function () {
    const countUsers = $('ul#friends-added').find("li");
    const groupChatName = $('#input-name-group-chat').val();
    if (countUsers.length < 2) {
      alertify.notify("Cần tối thiểu 2 người để tạo một nhóm trò chuyện !", "error", 5);
      return false;
    }
    if (groupChatName.length < 5 || groupChatName.length > 30) {
      alertify.notify("Tên nhóm trò chuyện yêu cầu tối thiểu 5 kí tự và có tối đa 30 ký tự !", "error", 5);
      return false;
    };
    const arrayIds = [{ userId }];
    $('ul#friends-added').find('li').each(function (index, item) {
      arrayIds.push({ userId: $(item).data("uid") });
    });
    Swal.fire({//Biến swal sử dụng trong thư viện sweetalert2
      title: 'Bạn có chắc chắn muốn tạo nhóm trò chuyện ?',
      text: "Bạn không thể hoàn tác quá trình này !",
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2ECC71',
      cancelButtonColor: '#ff7675',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
      if (!result.value) return false;
      $.post('/group-chat/add-new', { groupChatName, arrayIds }, function (result) {
        $('#btn-cancel-group-chat').click();

        //addRoomChat in leftSide
        let subGroupChatName = result.groupChat.name;
        const src = `https://cdn.adventuretravelnews.com/wp-content/uploads/2014/05/TourRadar_iPhone_icon-300x300.png`;
        if (subGroupChatName.length > 15) {
          subGroupChatName = subGroupChatName.substr(0, 14) + '<span>...</span>';
        };
        const roomChatLeftSide = `
      <a href="#uid_${result.groupChat._id}" class="room-chat" data-target="#to_${result.groupChat._id}">
            <li class="person" data-chat="${result.groupChat._id}">
              <div class="left-avatar">
                <img
                src=${src}
                  title=${result.groupChat.name}
                />
              </div>
              <span class="name">
                  ${subGroupChatName}
              </span>
              <span class="time"></span>
              <span class="preview  convert-emoji"></span>
            </li>
          </a>
      `
        $('#all-chat').find('ul').prepend(roomChatLeftSide);
        $('#group-chat').find('ul').prepend(roomChatLeftSide);

        //add RoomChat to rightSide
        const roomChatRightSide = `
      <div
        class="right tab-pane"
        data-chat="${result.groupChat._id}"
        id="to_${result.groupChat._id}"
      >
        <div class="top">
          <span>To: <span class="name">${groupChatName}</span></span>
          <span class="chat-menu-right">
            <a href="#attachmentsModal_${result.groupChat._id}" class="show-attachments" data-toggle="modal">
              Tệp đính kèm
              <i class="fa fa-paperclip"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="#imagesModal_${result.groupChat._id}" class="show-images" data-toggle="modal">
              Hình ảnh
              <i class="fa fa-photo"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
              Message amount:  <span class="show-number-messages">${result.groupChat.messageAmount}</span>
              <i class="fa fa-comment-o"></i>
            </a>
          </span>
            <span class="chat-menu-right">
              <a href="javascript:void(0)" class="number-members" data-toggle="modal">
              User amount: <span class="show-number-members">${result.groupChat.userAmount}</span>
                <i class="fa fa-users"></i>
              </a>
            </span>
        </div>
        <div class="content-chat">
          <div class="chat chat-in-group" data-chat="${result.groupChat._id}"></div>
        <div class="write" data-chat="${result.groupChat._id}">
          <input
            type="text"
            class="write-chat chat-in-group"
            id="write-chat-${result.groupChat._id}"
            data-chat="${result.groupChat._id}"
          />
          <div class="icons">
            <a href="#" class="icon-chat" data-chat="${result.groupChat._id}"
              ><i class="fa fa-smile-o"></i
            ></a>
            <label for="image-chat-${result.groupChat._id}">
              <input
                type="file"
                id="image-chat-${result.groupChat._id}"
                name="my-image-chat"
                class="image-chat chat-in-group"
                data-chat="${result.groupChat._id}"
              />
              <i class="fa fa-photo"></i>
            </label>
            <label for="attachment-chat-${result.groupChat._id}">
              <input
                type="file"
                id="attachment-chat-${result.groupChat._id}"
                name="my-attachment-chat"
                class="attachment-chat chat-in-group"
                data-chat="${result.groupChat._id}"
              />
              <i class="fa fa-paperclip"></i>
            </label>
            <a
              href="javascript:void(0)"
              id="video-chat-group"
            >
              <i class="fa fa-video-camera"></i>
            </a>
          </div>
        </div>
      </div>
      `
        $('#screen-chat').prepend(roomChatRightSide);
        changeScreenChat();
        //add imageModal
        const imageModal = `
      <div class="modal fade" id="imagesModal_${result.groupChat._id}" role="dialog">
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
      `
        $('body').append(imageModal);
        gridPhotos(5);
        //add attachmentModal
        const attachmentModal = `
        <div class="modal fade" id="attachmentsModal_${result.groupChat._id}" role="dialog">
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
        $('body').append(attachmentModal);

        //Bắn sự kiện tạo group tới những thành viên trong group
        socket.emit('create-group-chat',{groupChat:result.groupChat});
      })
        .fail(function (error) {
        alertify.notify('Tên cuộc trò chuyện yêu cầu tối thiểu 5 kí tự và có tối đa 30 kí tự !', 'error', 7);
        return false;
      });;
    })

  });
};
$(document).ready(function () {
  $('#input-search-friends-to-add-group-chat').bind('keypress', searchFriend);
  $('#btn-search-friends-to-add-group-chat').bind('click', searchFriend);
  createGroupChat();
  socket.on('response-create-group-chat',function(response){
  //addRoomChat in leftSide
  const src = `https://cdn.adventuretravelnews.com/wp-content/uploads/2014/05/TourRadar_iPhone_icon-300x300.png`;
  let subGroupChatName = response.groupChat.name;
  if (subGroupChatName.length > 15) {
    subGroupChatName = subGroupChatName.substr(0, 14) + '<span>...</span>';
  };
  const roomChatLeftSide = `
<a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
      <li class="person" data-chat="${response.groupChat._id}">
        <div class="left-avatar">
          <img
          src=${src}
            title=${response.groupChat.name}
          />
        </div>
        <span class="name">
            ${subGroupChatName}
        </span>
        <span class="time"></span>
        <span class="preview  convert-emoji"></span>
      </li>
    </a>
`
  $('#all-chat').find('ul').prepend(roomChatLeftSide);
  $('#group-chat').find('ul').prepend(roomChatLeftSide);

  //add RoomChat to rightSide
  const roomChatRightSide = `
<div
  class="right tab-pane"
  data-chat="${response.groupChat._id}"
  id="to_${response.groupChat._id}"
>
  <div class="top">
    <span>To: <span class="name">${subGroupChatName}</span></span>
    <span class="chat-menu-right">
      <a href="#attachmentsModal_${response.groupChat._id}" class="show-attachments" data-toggle="modal">
        Tệp đính kèm
        <i class="fa fa-paperclip"></i>
      </a>
    </span>
    <span class="chat-menu-right">
      <a href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">
        Hình ảnh
        <i class="fa fa-photo"></i>
      </a>
    </span>
    <span class="chat-menu-right">
      <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
        Message amount:  <span class="show-number-messages">${response.groupChat.messageAmount}</span>
        <i class="fa fa-comment-o"></i>
      </a>
    </span>
      <span class="chat-menu-right">
        <a href="javascript:void(0)" class="number-members" data-toggle="modal">
        User amount: <span class="show-number-members">${response.groupChat.userAmount}</span>
          <i class="fa fa-users"></i>
        </a>
      </span>
  </div>
  <div class="content-chat">
    <div class="chat chat-in-group" data-chat="${response.groupChat._id}"></div>
  <div class="write" data-chat="${response.groupChat._id}">
    <input
      type="text"
      class="write-chat chat-in-group"
      id="write-chat-${response.groupChat._id}"
      data-chat="${response.groupChat._id}"
    />
    <div class="icons">
      <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"
        ><i class="fa fa-smile-o"></i
      ></a>
      <label for="image-chat-${response.groupChat._id}">
        <input
          type="file"
          id="image-chat-${response.groupChat._id}"
          name="my-image-chat"
          class="image-chat chat-in-group"
          data-chat="${response.groupChat._id}"
        />
        <i class="fa fa-photo"></i>
      </label>
      <label for="attachment-chat-${response.groupChat._id}">
        <input
          type="file"
          id="attachment-chat-${response.groupChat._id}"
          name="my-attachment-chat"
          class="attachment-chat chat-in-group"
          data-chat="${response.groupChat._id}"
        />
        <i class="fa fa-paperclip"></i>
      </label>
      <a
        href="javascript:void(0)"
        id="video-chat-group"
      >
        <i class="fa fa-video-camera"></i>
      </a>
    </div>
  </div>
</div>
`
  $('#screen-chat').prepend(roomChatRightSide);
  changeScreenChat();
  //add imageModal
  const imageModal = `
<div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
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
`
  $('body').append(imageModal);
  gridPhotos(5);
  //add attachmentModal
  const attachmentModal = `
  <div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
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
  $('body').append(attachmentModal);
  });
});
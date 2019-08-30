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
    $('#cancel-group-chat').bind('click', function () {
      $('#groupChatModal .list-user-added').hide();
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

};
$(document).ready(function () {
    $('#input-search-friends-to-add-group-chat').bind('keypress', searchFriend);
    $('#btn-search-friends-to-add-group-chat').bind('click', searchFriend);
});
function removeContact() {//Khi chúng ta chấp nhận yêu cầu kết bạn
  $(".user-remove-contact")
    .unbind("click")
    .on("click", function () {
      const username = $(this).parent().find('div.user-name p').text();
      const targetId = $(this).data("uid");
      Swal.fire({//Biến swal sử dụng trong thư viện sweetalert2
        title: `Bạn có chắc chắn muốn xóa ${username} này trong danh bạ ?`,
        text: "Bạn không thể hoàn tác quá trình này !",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2ECC71',
        cancelButtonColor: '#ff7675',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy bỏ'
      }).then((result) => {//Nếu click vào cập nhật thì result.value = true => thực hiện gọi hàm callUpdateUserPassword
        if (!result.value) {
          return false;
        }
        $.ajax({
          url: '/contact/user-remove-contact',
          type: 'DELETE',
          data: { uid: targetId },
          success: function (data) {
            if (data.success) {
              $('#contacts').find(`ul li[data-uid=${targetId}]`).remove();
              decreaseNumberNotifiContact('count-contacts');
              //Sau này làm tiếp phần chat thì xóa khối userInfo ở phần chat
              socket.emit("user-remove-contact", { contactId: targetId });
              const checkActive = $('#all-chat').find(`li[data-chat = ${targetId}]`).hasClass('active');
              //Sau khi xóa liên hệ trong danh bạ thì xóa các message có liên quan ở bên leftSide
              $('#all-chat').find(`ul a[href="#uid_${targetId}"]`).remove();
              $("#user-chat").find(`ul a[href="#uid_${targetId}"]`)
              .remove();

              //Xóa bên rightSide
              $("#screen-chat").find(`div#to_${targetId}`).remove();

              //remove image modal
              $('body').find(`div#imagesModal_${targetId}`).remove();

              //remove attachment
              $('body').find(`div#attachmentsModal_${targetId}`).remove();
              if(checkActive){
                $('ul.people').find('a')[0].click();
              }
            };
          }
        });
      });
    });
};
socket.on("response-user-remove-contact", user => {//Khi chúng ta được một người khác đồng ý yêu cầu kết bạn.
  $('#contacts').find(`ul li[data-uid=${user.id}]`).remove();
  decreaseNumberNotifiContact('count-contacts');

   //Sau khi xóa liên hệ trong danh bạ thì xóa các message có liên quan ở bên leftSide
   const checkActive = $('#all-chat').find(`li[data-chat = ${user.id}]`).hasClass('active');
   $('#all-chat').find(`ul a[href="#uid_${user.id}"]`).remove();
   $("#user-chat").find(`ul a[href="#uid_${user.id}"]`)
   .remove();

   //Xóa bên rightSide
   $("#screen-chat").find(`div#to_${user.id}`).remove();

   //remove image modal
   $('body').find(`div#imagesModal_${user.id}`).remove();

   //remove attachment
   $('body').find(`div#attachmentsModal_${user.id}`).remove();

   if(checkActive){
     $('ul.people').find('a')[0].click();
   }
});
$(document).ready(function () {
  removeContact();
});

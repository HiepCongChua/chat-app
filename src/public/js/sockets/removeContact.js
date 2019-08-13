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
            console.log(data)
            if (data.success) {
              console.log(targetId);
              $('#contacts').find(`ul li[data-uid=${targetId}]`).remove();
              decreaseNumberNotifiContact('count-contacts');
              //Sau này làm tiếp phần chat thì xóa khối userInfo ở phần chat
              socket.emit("user-remove-contact", { contactId: targetId });
            };
          }
        });
      });
    });
};
socket.on("response-user-remove-contact", user => {//Khi chúng ta được một người khác đồng ý yêu cầu kết bạn.
  $('#contacts').find(`ul li[data-uid=${user.id}]`).remove();
  decreaseNumberNotifiContact('count-contacts');
});
$(document).ready(function () {
  removeContact();
});

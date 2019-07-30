let userAvatar = null;//
let userInfo = {};//Lưu trữ giá trị các filed dưới dạng object
let originAvatarSrc = null;//Đại diện cho đường dẫn của avatar
function updateUserInfo() {//Hàm lấy giá trị của từng field
  $("#input-change-avatar").bind("change", function() {
    const fileData = $(this).prop("files")[0];
    const math = ["image/png", "image/jpg", "image/jpeg"];
    const limit = 1048576;
    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify(
        "Định dạng file không hợp lệ chỉ chấp nhận jpg, png hoặc jpeg !",
        "error",
        5
      );
      $(this).val(null);
      return false;
    }
    if (fileData.size > limit) {
      alertify.notify("Kích thước file vượt quá 1MB, vui lòng thử lại !", "error",5);
      $(this).val(null);
      return false;
    };
    if (typeof FileReader != "undefined") {
      const imagePreview = $("#image-edit-profile");
      imagePreview.empty();
      const fileReader = new FileReader();
      fileReader.onload = function(element) {
        $("<img>", {
          src: element.target.result,
          class: "avatar img-circle",
          id: "user-modal-avatar",
          alt: "avatar"
        }).appendTo(imagePreview);
      };
      imagePreview.show();
      fileReader.readAsDataURL(fileData);
      let formData = new FormData();
      formData.append("avatar", fileData);
      userAvatar = formData;
    } else {
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader", "error");
    }
  });
  $("#input-change-username").bind("change", function() {
    userInfo.username = $(this).val();
  });
  $("#input-change-gender-male").bind("click", function() {
    userInfo.gender = $(this).val();
  });
  $("#input-change-gender-female").bind("click", function() {
    userInfo.gender = $(this).val();
  });
  $("#input-change-address").bind("change", function() {
    userInfo.address = $(this).val();
  });
  $("#input-change-phone").bind("change", function() {
    userInfo.phone = $(this).val();
  });
}
$(document).ready(function() {
  updateUserInfo();
  originAvatarSrc = $("#user-modal-avatar").attr("src");//Lấy đường dẫn ban đầu của avarta
  console.log(originAvatarSrc);
  $("#input-btn-update-user").bind("click", function() {
    if($.isEmptyObject(userInfo)&& !userAvatar){//Trong trường hợp nếu ấn cập nhật nhưng các field trống
        alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu !","error");
        return false;
    }
    $.ajax({
        url:"/user/update-avatar",
        type:"PUT",
        cache:false,
        contentType : false,
        processData:false,
        data:userAvatar,
        success:function(res){
          console.log(res);
          $('.user-modal-alert-success').find("span").text(res.message);//Sau khi nhận được lỗi thì tìm thẻ span trong div user-modal-alert-error và
          //  chèn text (lấy giá trị của text ở response text và server gửi về)
          $('.user-modal-alert-success').css("display","block");
           $('#navbar-avatar').attr('src',res.imageSrc);//Đổi avatar nhỏ
          originAvatarSrc = res.imageSrc; //Đổi đường dẫn avatar lớn
          $("#input-btn-cancel-update-user").click();//Sau khi phát sinh lỗi thì tự độ refresh lại trang bằng cách invoked nút cancle
        },
        error:function(err){   
          console.log(err);
          $('.user-modal-alert-error').find("span").text(err.responseText);//Sau khi nhận được lỗi thì tìm thẻ span trong div user-modal-alert-error và
          //  chèn text (lấy giá trị của text ở response text và server gửi về)
          $('.user-modal-alert-error').css("display","block");
          $("#input-btn-cancel-update-user").click();//Sau khi phát sinh lỗi thì tự độ refresh lại trang bằng cách invoked nút cancle
        }
    })
  });
  $("#input-btn-cancel-update-user").bind("click", function() {
    userAvatar = null;
    userInfo = {};
    $('#input-change-avatar').val(null);
    $("#user-modal-avatar").attr("src", originAvatarSrc);//Khi nhấn nút remove thì đặt lại  url ban đầu của avatar
  });
});

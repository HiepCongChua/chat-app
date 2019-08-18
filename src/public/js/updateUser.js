let userAvatar = null; //
let userInfo = {}; //Lưu trữ giá trị các filed dưới dạng object
let originAvatarSrc = null; //Đại diện cho đường dẫn của avatar
let originUserInfo = {};
let userUpdatePassword = {};
function updateUserInfo() {
  //Hàm lấy giá trị của từng field, đồng thời validate giá trị của từng field trước khi gửi lên server
  $("#input-change-avatar").bind("change", function() {
    const fileData = $(this).prop("files")[0];
    const math = ["image/png", "image/jpg", "image/jpeg"];
    const limit = 1048576;
    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify(
        "Định dạng file không hợp lệ chỉ chấp nhận tệp có đuôi jpg, png hoặc jpeg !",
        "error",
        5
      );
      $(this).val(null);
      return false;
    }
    if (fileData.size > limit) {
      alertify.notify(
        "Kích thước file vượt quá 1MB, vui lòng thử lại !",
        "error",
        5
      );
      $(this).val(null);
      return false;
    }
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
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader", "error",5);
    }
  });
  $("#input-change-username").bind("change", function() {
    const username = $(this).val();
    const regexUserName = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!regexUserName.test(username)|| username.length<3 || username.length >17)
    {
      alertify.notify("Username giới hạn trong khoảng 3-17 kí tự và không chứa kí tự đặc biệt.","error",5);
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    };
    userInfo.username = $(this).val();
  }); 
  $("#input-change-gender-male").bind("click", function() {
    const gender = $(this).val();
    if(gender!=="male")
    {
      alertify.notify("Dữ liệu trường giới tính của bạn có vấn đề, bạn không xác định được giới tính của mình ?","error",5);
      $(this).val(originUserInfo.gender);//Trả về giá trị ban đầu
      delete userInfo.gender;//Xóa properti khởi userInfo
      return false;
    };
    userInfo.gender = $(this).val();
  });
  $("#input-change-gender-female").bind("click", function() {
    const gender = $(this).val();
    if(gender!=="female")
    {
      alertify.notify("Dữ liệu trường giới tính của bạn có vấn đề, bạn không xác định được giới tính của mình ?","error",5);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    };
    userInfo.gender = $(this).val();
  });
  $("#input-change-address").bind("change", function() {
    const address = $(this).val();
    if(address.length<5&&address.length>30)
    {
      alertify.notify("Địa chỉ của bạn giới hạn trong khoảng 5-30 kí tự và không chứa kí tự đặc biệt.","error",5);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    };
    userInfo.address = address;
  });
  $("#input-change-phone").bind("change", function() {
    const phone = $(this).val();
    const regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);
    if(!regexPhone.test(phone))
    {
      alertify.notify("Số điện thoại không hợp lệ, giá trị phải bắt đầu bằng số 0 có từ 10 -> 12 kí tự .","error",5);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    };
    userInfo.phone = phone;

  });
  $("#input-change-current-password").bind("change", function() {
   const currentPass = $(this).val();
   const regexPass = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
   if(!regexPass.test(currentPass)){
    alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và kí đặt biệt ví dụ như aA@123456","error",5);
    $(this).val(null);
    delete userUpdatePassword.currentPass;
    return false;
   }
   userUpdatePassword.currentPass = currentPass;
  });
  $("#input-change-new-password").bind("change", function() {
    const newPass = $(this).val();
   const regexPass = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
   if(!regexPass.test(newPass)){
    alertify.notify("Mật khẩu mới phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và kí đặt biệt.","error",5);
    $(this).val(null);
    delete userUpdatePassword.newPass;
    return false;
   }
   userUpdatePassword.newPass = newPass;
  });
  $("#input-change-confirm-new-password").bind("change", function() {
    const confirmPass = $(this).val();
   if(!userUpdatePassword.newPass)
   {
    alertify.notify("Bạn chưa nhập mật khẩu mới.","error",5); 
    $(this).val(null);
    return false;
   };
   if(confirmPass!==userUpdatePassword.newPass){
    alertify.notify("Mật khẩu nhập lại không khớp với mật khẩu mới.","error",5);
    $(this).val(null);
    return false;
   }
   userUpdatePassword.confirmPass = confirmPass;
  });
};
function callUpdateAvatar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "PUT",
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function(res) {
      $(".user-modal-alert-success")
        .find("span")
        .text(res.message); //Sau khi nhận được lỗi thì tìm thẻ span trong div user-modal-alert-error và
      //  chèn text (lấy giá trị của text ở response text và server gửi về)
      $(".user-modal-alert-success").css("display", "block");
      $("#navbar-avatar").attr("src", res.imageSrc); //Đổi avatar nhỏ
      originAvatarSrc = res.imageSrc; //Đổi đường dẫn avatar lớn
      $("#input-btn-cancel-update-user").click(); //Sau khi phát sinh lỗi thì tự độ refresh lại trang bằng cách invoked nút cancle
    },
    error: function(err) {
      console.log(err);
      $(".user-modal-alert-error")
        .find("span")
        .text(err.responseText); //Sau khi nhận được lỗi thì tìm thẻ span trong div user-modal-alert-error và
      //  chèn text (lấy giá trị của text ở response text và server gửi về)
      $(".user-modal-alert-error").css("display", "block");
      $("#input-btn-cancel-update-user").click(); //Sau khi phát sinh lỗi thì tự độ refresh lại trang bằng cách invoked nút cancle
    }
  });
};
function callUpdateInfo() {
  $.ajax({
    url: "/user/update-info",
    type: "PUT",
    data: userInfo,
    success: function(res) {
      console.log(res);
      $(".user-modal-alert-success")
        .find("span")
        .text(res.message); //Sau khi nhận được lỗi thì tìm thẻ span trong div user-modal-alert-error và
      //  chèn text (lấy giá trị của text ở response text và server gửi về)
      $(".user-modal-alert-success").css("display", "block");
      originUserInfo = Object.assign(originUserInfo, userInfo); //Vì các key của originUserInfo giống hệt nhau nếu value nào của 2 object lệch nhau thì sẽ bị ghi đè bởi userInfo
      $("#navbar-username").text(originUserInfo.username);
      $("#input-btn-cancel-update-user").click(); //Sau khi cập nhật thì gọi hàm click của button cancel để refresh lại trang bằng cách invoked nút cancle
    },
    error: function(err) {
      console.log(err);
      $(".user-modal-alert-error")
        .find("span")
        .text(err.responseText); //Sau khi nhận được lỗi thì tìm thẻ span trong div user-modal-alert-error và
      //  chèn text (lấy giá trị của text ở response text và server gửi về)
      $(".user-modal-alert-error").css("display", "block");
      $("#input-btn-cancel-update-user").click(); //Sau khi phát sinh lỗi thì tự độ refresh lại trang bằng cách invoked nút cancle
    }
  });
};
function callLogOut(){
  let timerInterval;
  Swal.fire({
    position: 'top-end',
    title: 'Tự động đăng xuất sau 5 giây',
    html:`Thời gian: <strong></strong>`,
    showConfirmButton: false,
    timer: 5000,
    onBeforeOpen:()=>{
      Swal.showLoading();
      timerInterval = setInterval(()=>{
         Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
      },1000);
    },
    onClose:()=>{
      clearInterval(timerInterval)
    }
  }).then((result)=>{
      $.get('/logout',function(){
          location.reload();
      });
  });
};  
function callUpdateUserPassword(){
  $.ajax({
    url: "/user/update-password",
    type: "PUT",
    data: userUpdatePassword,
    success: function(res) {
      console.log(res);
      $(".user-modal-password-alert-success")
        .find("span")
        .text(res.message); //Sau khi nhận được lỗi thì tìm thẻ span trong div user-modal-alert-error và
      //  chèn text (lấy giá trị của text ở response text và server gửi về)
      $(".user-modal-password-alert-success").css("display", "block");
      originUserInfo = Object.assign(originUserInfo, userInfo); //Vì các key của originUserInfo giống hệt nhau nếu value nào của 2 object lệch nhau thì sẽ bị ghi đè bởi userInfo
      $("#navbar-username").text(originUserInfo.username);
      $("#input-btn-cancel-update-user-password").click(); //Sau khi cập nhật thì gọi hàm click của button cancel để refresh lại trang bằng cách invoked nút cancle
      //Thực hiện đăng xuất sau 5s khi cập nhật mật khẩu. 
      callLogOut();
    },
    error: function(err) {
      console.log(err);
      $(".user-modal-password-alert-error")
        .find("span")
        .text(err.responseText); //Sau khi nhận được lỗi thì tìm thẻ span trong div user-modal-alert-error và
      //  chèn text (lấy giá trị của text ở response text và server gửi về)
      $(".user-modal-password-alert-error").css("display", "block");
      $("#input-btn-cancel-update-user-password").click(); //Sau khi phát sinh lỗi thì tự độ refresh lại trang bằng cách invoked nút cancle
    }
  });
};
$(document).ready(function() {
  originAvatarSrc = $("#user-modal-avatar").attr("src"); //Lấy đường dẫn ban đầu của avarta
  originUserInfo = {
    //Giá trị của các filed ban đầu , để người dùng có thể reset lạ giá trị ban đầu
    username: $("#input-change-username").val(),
    gender: $("#input-change-gender-male").val()
      ? $("#input-change-gender-male").val()
      : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  };
  updateUserInfo();
  $("#input-btn-update-user").bind("click", function() {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      //Trong trường hợp nếu ấn cập nhật nhưng các field trống
      alertify.notify(//Đây là hàm có sẵn trong thư viện
        "Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu !",
        "error",
        3
      );
      return false;
    };
    if (userAvatar) {
      callUpdateAvatar(); //nếu dữ liệu field avatar hợp lệ thì gọi hàm cập nhật avatar
    }
    if (!$.isEmptyObject(userInfo)) {
      callUpdateInfo(); //Nếu dữ liệu các field đầu vào hợp lệ thì thực hiện gọi hàm cập nhật info
    };
  });
  $("#input-btn-cancel-update-user").bind("click", function() {
    //Khi người dùng nhấn remove thì trả lại tất cả giá trị cũ
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvatarSrc); //Khi nhấn nút remove thì đặt lại  url ban đầu của avatar
    $("#input-change-username").val(originUserInfo.username);
    originUserInfo.gender == "male"
      ? $("#input-change-gender-male").click()
      : $("#input-change-gender-female").click(); //Nếu giá trị ban đầu là male thì gọi hàm click ở checkobx male
    $("#input-change-username").val(originUserInfo.username);
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
  });
  $("#input-btn-update-user-password").bind("click",function(){
    
    if(Object.keys(userUpdatePassword).length!==3)
    {
       alertify.notify("Bạn phải nhập đầy đủ thông tin !","error",5);
       return false;
    };
    Swal.fire({//Biến swal sử dụng trong thư viện sweetalert2
      title: 'Bạn có chắc chắn muốn cập nhật mật khẩu?',
      text: "Bạn không thể hoàn tác quá trình này !",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ECC71',
      cancelButtonColor: '#ff7675',
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Hủy bỏ'
    }).then((result) => {//Nếu click vào cập nhật thì result.value = true => thực hiện gọi hàm callUpdateUserPassword
     if(result.value)
     {
       $('#input-btn-cancel-update-user-password').click();
      return  callUpdateUserPassword();
     }
      return false;
    })
   
  });
  $("#input-btn-cancel-update-user-password").bind("click",function(){
    userUpdatePassword = {};
    $("#input-change-new-password").val(null);
    $("#input-change-current-password").val(null);
    $("#input-change-confirm-new-password").val(null);
  });
});




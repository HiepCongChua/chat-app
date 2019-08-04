function callFindUsers (e){
    const keyword =  $('#input-find-users-contact').val();
    const regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
   if(!regexKeyword.test(keyword))
   {
       alertify.notify("Lỗi từ khóa chỉ cho phép kí tự chữ cái và số, cho phép khoảng trống.","success",5);
       return false;
   };
    $.get(`/contact/find-users/${keyword}`,function(data){
          $('#find-user ul').html(data);
          addContact()//đây là hàm ở file addContact.js được chèn bên trên file findUsersContact
    });
};
$(document).ready(function(){
    // $('#input-find-users-contact').bind('keypress',callFindUsers);
    $('#btn-find-users-contact').bind('click',callFindUsers);
});
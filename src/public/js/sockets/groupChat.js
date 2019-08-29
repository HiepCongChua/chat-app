function searchFriend(e){
    if(e.which===13||e.type==='click'){
        const keyword = $('#input-search-friends-to-add-group-chat').val();
        const regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
      if(!keyword.length){
       alertify.notify("Chưa nhập nội dung tìm kiếm.","error",5);
       return false;
      };
     if(!regexKeyword.test(keyword))
     {
         alertify.notify("Lỗi từ khóa chỉ cho phép kí tự chữ cái và số, cho phép khoảng trống.","success",5);
         return false;
     };
      $.get(`/contact/find-friends/${keyword}`,{keyword},function(data){
            $('ul#group-chat-friends').html(data);
            addContact()//đây là hàm ở file addContact.js được chèn bên trên file findUsersContact
            removeRequestContactSent();
      });
      };
};
function createGroupChat(){

};
$(document).ready(function(){
    $('#input-search-friends-to-add-group-chat').bind('keypress',searchFriend);
    $('#btn-search-friends-to-add-group-chat').bind('click',searchFriend);
});
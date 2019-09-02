
$(document).ready(function () {
  $("#link-read-more-contacts").bind("click", function () {
    const skipNumber = $('#contacts').find('li').length;
    $("#link-read-more-contacts").css('display', 'none');
    $(".read-more-contacts-loader").css('display', 'inline-block');
    setTimeout(() => {
      $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, function (contacts) {
        if (contacts.length === 0) {
          alertify.notify("Không còn bạn bè nào trong danh bạ.","error",5);  
          $("#link-read-more-contacts").css('display', 'none');
          $(".read-more-contacts-loader").css('display', 'none');
          return false;
        };
        contacts = contacts.map(contact => {
          return contact[0];
        });
        contacts.forEach(contact => {
          let src = ''
          if (!contact.avatar) {
            src = ' https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png '
          }
          else {
            src = `images/users/${contact.avatar}`
          }
          $('#contacts').find("ul").append(`
             <li class="_contactList" data-uid="${contact._id}">
             <div class="contactPanel">
               <div class="user-avatar">
                 <img src="${src}" alt=""/>
                           </div>
                           <div class="user-name">
                             <p>
                               ${contact.username}
                             </p>
                           </div>
                           <br />
                           <div class=" user-address">
                 <span>&nbsp; ${contact.address || ''} </span>
               </div>
               <div class="user-talk" data-uid="${contact._id}">
                 Trò chuyện
               </div>
               <div class="user-remove-contact action-danger" data-uid="${contact._id}">
                 Xóa liên hệ
               </div>
             </div>
           </li>
             `);
        });

        removeContact();
        $("#link-read-more-contacts").css('display', 'inline-block');
        $(".read-more-contacts-loader").css('display', 'none');
      });
    }, 1000)
  });
});  
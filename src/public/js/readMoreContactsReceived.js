
 $(document).ready(function(){
    $("#link-read-more-contacts-received").bind("click",function(){
        const skipNumber = $('#request-contact-received').find('li').length;
        $("#link-read-more-contacts-received").css('display','none');
        $(".read-more-contacts-loader").css('display','inline-block');
        $.get(`/contact/read-more-contacts-received?skipNumber=${skipNumber}`,function(contacts){
            if(contacts.length===0)
            {
              alertify.notify("Bạn không còn lời mời nào ^^.","error",5);  
             $("#link-read-more-contacts-received").css('display','inline-block');
             $(".read-more-contacts-loader").css('display','none');
              return false;
            };
            contacts = contacts.map(contact=>{
                 return contact[0];
            });
            contacts.forEach(contact => {
              if(!contact.avatar)
              {
                contact.avatar = ' https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png '
              }
             $('#request-contact-received').find("ul").append(`
             <li style="text-decoration: none" class="_contactList" data-uid="${contact._id}">
             <div class="contactPanel">
               <div class="user-avatar">
                 <img src="${contact.avatar}"
                         alt=""
                       />
                     </div>
                     <div class="user-name">
                       <p>
                         ${contact.username}
                       </p>
                     </div>
                     <br />
 
                     <div class=" user-address">
                 <span>&nbsp ${contact.address||''} </span>
               </div>
               <div class="user-acccept-contact-received" data-uid="${contact._id}">
                 Chấp nhận
               </div>
               <div class="user-reject-request-contact-received action-danger" data-uid="${contact._id}">
                 Xóa yêu cầu
               </div>
             </div>
           </li>
             `);
            });
              $("#link-read-more-contacts-received").css('display','inline-block');
            $(".read-more-contacts-loader").css('display','none');
        });
    });
  });  
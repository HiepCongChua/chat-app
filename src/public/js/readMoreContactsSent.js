
 $(document).ready(function(){
    $("#link-read-more-contacts-sent").bind("click",function(){
        const skipNumber = $('#request-contact-sent').find('li').length;
        $("#link-read-more-contacts-sent").css('display','none');
        $(".read-more-contacts-loader").css('display','inline-block');
        $.get(`/contact/read-more-contacts-sent?skipNumber=${skipNumber}`,function(contacts){
            if(contacts.length===0)
            {
              alertify.notify("Bạn không còn lời mời nào ^^.","error",5);  
             $("#link-read-more-contacts-sent").css('display','inline-block');
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
             $('#request-contact-sent').find("ul").append(`
             <li class="_contactList" data-uid="${contact._id}">
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
                <span>&nbsp; ${contact.address||''}</span>
              </div>
              <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${contact._id}">
                Hủy yêu cầu
              </div>
            </div>
          </li>
             `);
            });
            removeRequestContactSent();
              $("#link-read-more-contacts-sent").css('display','inline-block');
            $(".read-more-contacts-loader").css('display','none');
        });
    });
  });  
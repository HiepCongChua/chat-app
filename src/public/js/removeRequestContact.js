function removeRequestContact(){
    $('.user-remove-request-contact').bind('click',function(){
    let targetId = $(this).data('uid');
    console.log(targetId);
     $.ajax({
         url:'contact/remove-request-contact',
         type:'DELETE',
         data:{uid:targetId},
         success:function(data){
             if(data.success)
             {
            $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display","inline-block");
            $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide(); 
            decreaseNumberNotifiContact('count-request-contact-sent'); 
             }
         }
     });
    });
}
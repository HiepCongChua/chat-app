function addContact(){
    $('.user-add-new-contact').bind('click',function(){
    let targetId = $(this).data('uid');
    console.log(targetId);
   $.post('/contact/add-new',{uid:targetId},function(data){
       console.log(data,targetId);
        if(data.success)
        {
            $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
            $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display","inline-block");
            //Xủ lý 2 nút button
        }
    });  
    });
}
function addContact(){
    $('.user-add-new-contact').bind('click',function(){
    let targetId = $(this).data('uid');
   $.post('/contact/add-new',{uid:targetId},function(data){
        if(data.success)
        {
            // /Xủ lý 2 nút button
            $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
            $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display","inline-block");
            
            //Khi nhấn thêm mới thì đồng thời tăng giá trị trên màn hình.
            increaseNumberNotifiContact('count-request-contact-sent'); 
            socket.emit("add-new-contact",{//Khi addContact thì bắn một sự kiện lên server
                contactId:targetId
            })
        }
    });  
    });
} 
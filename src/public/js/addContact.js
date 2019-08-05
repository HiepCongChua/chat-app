// function increaseNumberNotifiContact(className){
//     let currentValue = +($(`.${className}`).find("em").text());//thêm dấu + vào trước string nó sẽ tự động convert sang kiểu number
//     currentValue += 1;
//     console.log(currentValue);
//     if(currentValue===0)
//     {
//       $(`.${className}`).html('');  
//     }
//     else {
//         $(`.${className}`).html(`(<em>${currentValue}</em>)`);
//     }
// }
function addContact(){
    $('.user-add-new-contact').bind('click',function(){
    let targetId = $(this).data('uid');
   $.post('/contact/add-new',{uid:targetId},function(data){
        if(data.success)
        {
            $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
            $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display","inline-block");
            //Xủ lý 2 nút button
            increaseNumberNotifiContact('count-request-contact-sent'); 
        }
    });  
    });
}
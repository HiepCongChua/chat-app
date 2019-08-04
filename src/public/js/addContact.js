function addContat(){
    $('.user-add-new-contact').bind('click',function(){
        const targetId = $(this).data('uid');
        console.log(targetId);
   $.post('/contact/add-new',{uid:targetId},function(data){
        // if(data.success)
        // {
        //     console.log(data);
        // }
        console.log(data);
    }); 
    });
  
}
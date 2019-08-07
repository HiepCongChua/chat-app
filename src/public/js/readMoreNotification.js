 $(document).ready(function(){
   $("#link-read-more-notif").bind("click",function(){
       const skipNumber = $('ul.list-notifications').find('li').length;
       $("#link-read-more-notif").css('display','none');
       $(".read-more-loader").css('display','inline-block');
       $.get(`/notification/read-more?skipNumber=${skipNumber}`,function(notifications){
           if(notifications.length===0)
           {
             alertify.notify("Bạn không còn thông báo nào ^^.","error",5);  
            $("#link-read-more-notif").css('display','inline-block');
            $(".read-more-loader").css('display','none');
             return false;
           };
           notifications.forEach(notification => {
            $('ul.list-notifications').append(`<li>${notification}</li>`);
           });
             $("#link-read-more-notif").css('display','inline-block');
           $(".read-more-loader").css('display','none');
       });
   });
 });
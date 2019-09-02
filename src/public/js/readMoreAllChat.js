
$(document).ready(function () {
    $("#link-read-more-all-chat").bind("click", function () {
        const skipChatPersonal = $('#all-chat').find('li:not(.group-chat)').length;
        const skipChatGroup = $('#all-chat').find('li.group-chat').length;
        console.log(skipChatPersonal, skipChatGroup);
        $("#link-read-more-all-chat").css('display', 'none');
        $(".read-more-all-chat-loader").css('display', 'inline-block');
        $.get(`/message/read-more-all-chat?skipChatPersonal=${skipChatPersonal}&skipChatGroup=${skipChatGroup}`, function (conversations) {
            if(conversations.leftSideData.trim()===''){
                alertify.notify("Bạn không còn cuộc trò chuyện nào.","error",5);  
                $("#link-read-more-all-chat").css('display', 'none');
                $(".read-more-all-chat-loader").css('display', 'none');
                return false;
            }
            $("#link-read-more-all-chat").css('display', 'inline-block');
            $(".read-more-all-chat-loader").css('display', 'none');
        });
    });
});  
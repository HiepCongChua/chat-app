$(document).ready(function () {
    $("#link-read-more-all-chat").bind("click", function () {
        const skipChatPersonal = $('#all-chat').find('li:not(.group-chat)').length;
        const skipChatGroup = $('#all-chat').find('li.group-chat').length;
        $("#link-read-more-all-chat").css('display', 'none');
        $(".read-more-all-chat-loader").css('display', 'inline-block');
        $.get(`/message/read-more-all-chat?skipChatPersonal=${skipChatPersonal}&skipChatGroup=${skipChatGroup}`, function (data) {
            if(data.leftSideData.trim()===''){
                alertify.notify("Bạn không còn cuộc trò chuyện nào.","error",5);  
                $("#link-read-more-all-chat").css('display', 'none');
                $(".read-more-all-chat-loader").css('display', 'none');
                return false;
            }
            $('#all-chat').find('ul').append(data.leftSideData);
            resizeNineScrollLeft();
            nineScrollLeft();
            $('#screen-chat').append(data.rightSideData);
            changeScreenChat();
            convertEmoji();
            $('body').append(data.imageModalData);
            gridPhotos(5);
            $('body').append(data.attachmentModalData);
            $("#link-read-more-all-chat").css('display', 'inline-block');
            $(".read-more-all-chat-loader").css('display', 'none');
            readMoreMessage();
        });
    });
});  
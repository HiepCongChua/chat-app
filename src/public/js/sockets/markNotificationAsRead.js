$(document).ready(function () {
    $("#popup-mark-notif-as-read").bind("click", function () {
        let targetUsers = [];
        $('.noti_content').find("div.notif-readed-false").each(function (index, notification) {
            targetUsers = [...targetUsers, $(notification).data("uid")];
        });
        if (!targetUsers.length) {
            alertify.notify("Bạn không còn thông báo nào chưa đọc", "error", 5);
            return false;
        };
        markNotificationsAsRead(targetUsers);
    });
    $("#modal-mark-notif-as-read").bind("click", function () {
        let targetUsers = [];
        $('ul.list-notifications').find("li>div.notif-readed-false").each(function (index, notification) {
            targetUsers = [...targetUsers, $(notification).data("uid")];
        })
        if (!targetUsers.length) {
            alertify.notify("Bạn không còn thông báo nào chưa đọc", "error", 5);
            return false;
        };
        markNotificationsAsRead(targetUsers);
    });
    function markNotificationsAsRead(targetUsers) {
        $.ajax({
            url: '/notification/mark-all-as-read',
            type: 'put',
            data:{targetUsers},
            success:function(res){
                targetUsers.forEach(uid => {//uid là những id của sender (người gửi lời mời kết bạn) mỗi div notifi có uid là id của sender
                    $('.noti_content').find(`div[data-uid=${uid}]`).removeClass('notif-readed-false');
                    $('ul.list-notifications').find(`li>div[data-uid=${uid}]`).removeClass('notif-readed-false');
                });
                decreaseNumberNotification("noti_counter",targetUsers.length);//trừ đi số lượng thông báo đã đọc 
            }
        });
    };
});
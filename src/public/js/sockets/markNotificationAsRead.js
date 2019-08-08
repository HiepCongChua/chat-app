import { type } from "os";

$(document).ready(function () {
    $("#popup-mark-notif-as-read").bind("click", function () {
        let targetUsers = [];
        $('.noti_content').find("div.notif-readed-false").each(function (index, notification) {
            targetUsers = [...targetUsers, $(notification).data("uid")];
        });
        if (!targetUsers) {
            alertify.notify("Bạn không còn thông báo nào chưa đọc", "error", 5);
            return false;
        }
        console.log(targetUsers, targetUsers.length);
    });
    $("#modal-mark-notif-as-read").bind("click", function () {
        let targetUsers = [];
        $('ul.list-notifications').find("li>div.notif-readed-false").each(function (index, notification) {
            targetUsers = [...targetUsers, $(notification).data("uid")];
        });
        if (!targetUsers) {
            alertify.notify("Bạn không còn thông báo nào chưa đọc", "error", 5);
            return false;
        }
        console.log(targetUsers, targetUsers.length);
    });
    function markNotificationsAsRead(targetUsers) {
        $.ajax({
            url: '/notification/mark-all-as-read',
            type: 'put',
            data:{targetUsers},
            success:function(res){
                console.log(res);
            }
        });
    }
})
socket.on("server-send-list-users-online", (listUsersId) => {
    listUsersId.forEach(id => {
        $(`.person[data-chat=${id}]`).find("div.dot").addClass("online");
        $(`.person[data-chat=${id}]`).find("img").addClass("avatar-online");
    });
});
socket.on("server-send-when-new-user-login", function (id) {
    $(`.person[data-chat=${id}]`).find("div.dot").addClass("online");
    $(`.person[data-chat=${id}]`).find("img").addClass("avatar-online");
});
socket.on("server-send-when-new-user-logout",function(id){
    $(`.person[data-chat=${id}]`).find("div.dot").removeClass("online");
    $(`.person[data-chat=${id}]`).find("img").removeClass("avatar-online");
});

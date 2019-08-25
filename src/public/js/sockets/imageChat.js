function imageChat(divId){
    $(`#image-chat-${divId}`).unbind("change").on("change",function(){
       const fileData = $(this).prop("files")[0];
    const math = ["image/png", "image/jpg", "image/jpeg"];
    const limit = 1024*1024;
    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify(
        "Định dạng file không hợp lệ chỉ chấp nhận tệp có đuôi jpg, png hoặc jpeg !",
        "error",
        5
      );
      $(this).val(null);
      return false;
    }
    if (fileData.size > limit) {
      alertify.notify(
        "Dung lượng ảnh vượt quá 1MB, vui lòng thử lại !",
        "error",
        5
      );
      $(this).val(null);
      return false;
    }
    const targetId = $(this).data("chat");
    let isChatGroup = false;
    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid",targetId);
    if ($(this).hasClass('chat-in-group')) {
        messageFormData.append("isChatGroup",true);
        isChatGroup = true;
    }
    $.ajax({
        url: "/message/add-message-image",
        type: "post",
        cache: false,
        contentType: false,
        processData: false,
        data: messageFormData,
        success: function(data) {
            const dataToEmit = {
                message: data.message
            };
            const messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}" ></div>`);
            messageOfMe.text(data.message.text);
            const imageMessage = `<img src="${data.message.imageUrl}" class="show-image-chat">`
            if (isChatGroup) {
                const src = (data.message.sender.avatar === null) ? 'images/users/no-avatar.png' : `/images/users/${data.message.sender.avatar}`
                const senderAvatar = `<img class="avatar-small" src=${src} title="${data.message.sender.name}">`;
                messageOfMe.html(`${senderAvatar} ${imageMessage}`);
                increaseNumberMessageGroup(divId);//Tăng số lượng tin nhắn
                dataToEmit.groupId = targetId;
            }
            else {
                messageOfMe.html(imageMessage);//Sau khi conver thì lại đẩy vào div
                dataToEmit.contactId = targetId;
            };
            $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);//đẩy tin nhắn mới vào cuối danh sách
            nineScrollRight(divId);//tự động cuộn trang xuống dưới mỗi khi gửi tin nhắn
            $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf('seconds').fromNow());
            $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");
            $(`.person[data-chat=${divId}]`).on("typing.moveConverstationToTheTop", function () {
                const dataMove = $(this).parent();
                $(this).closest("ul").prepend(dataMove);
                $(this).off("typing.moveConverstationToTheTop");
            });
            $(`.person[data-chat=${divId}]`).trigger("typing.moveConverstationToTheTop");
            socket.emit("chat-message-image", dataToEmit);//bắn sự kiện socket cho group hoặc 
            //Thêm image vào list hình ảnh.
            const imageChatToAddModal = `<img src="${data.message.imageUrl}">`;
            $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
        },
        error: function(err) {
           if(err.responseJSON.code==="LIMIT_FILE_SIZE"){
                 alertify.notify('Kích thước file vượt quá 1MB xin vui lòng thử lại !',"error",5);
           }
           else if(err.responseJSON.code==="IMAGE_MESSAGE_TYPE")
           {
            alertify.notify('Định dạng file không hợp lệ chỉ chấp nhận đuôi jpg, png và jpeg',"error",5);
           } 
           return;
        }
      });
    });
};

$(document).ready(function(){
    socket.on("response-chat-message-image",function(response){
            //Xử lý dữ liệu
            let divId = "";
            const messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}" ></div>`);
            messageOfYou.text(response.message.text);
            let messageImage = `<img src="${response.message.imageUrl}" class="show-image-chat">`;
            if (response.currentGroupId) {
                const src = (response.message.sender.avatar === null) ? '/images/users/no-avatar.png' : `/images/users/${response.message.sender.avatar}`
                const senderAvatar = `<img class="avatar-small" src="${src}" title="${response.message.sender.name}">`;
                messageOfYou.html(`${senderAvatar} ${messageImage}`);
                divId = response.currentGroupId;
                if (response.currentUserId !== $(`#dropdown-navbar-user`).data("uid")) {
                    $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
                      increaseNumberMessageGroup(divId);//Tăng số lượng tin nhắn
                }
            }
            else {
                messageOfYou.html(messageImage);//Sau khi conver thì lại đẩy vào div
                divId = response.currentUserId;
            };
            //Sau khi xử lý dữ liệu thì hiển thị lên màn hình.
            //Khi server bắn sự kiện về thì phải loại trừ user hiện tại không cần phải append nữa vì đã append lúc bắn sự kiện rồi.
            //bởi vì user hiện tại cũng có socketId nằm trong mảng socketGroupId.
            if (response.currentUserId !== $(`#dropdown-navbar-user`).data("uid")) {
                $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);//đẩy tin nhắn mới vào cuối danh sách
                nineScrollRight(divId);//tự động cuộn trang xuống dưới mỗi khi gửi tin nhắn
                $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
            }
            //Xử lý phần leftSide và timeStamp;
            $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf('seconds').fromNow());
            $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");
            //Đẩy cuộc trò chuyện lên đầu leftSide.
            $(`.person[data-chat=${divId}]`).on("typing.moveConverstationToTheTop", function () {
                const dataMove = $(this).parent();
                $(this).closest("ul").prepend(dataMove);
                $(this).off("typing.moveConverstationToTheTop");
            });
            $(`.person[data-chat=${divId}]`).trigger("typing.moveConverstationToTheTop");
            if (response.currentUserId !== $(`#dropdown-navbar-user`).data("uid")) {
            const imageChatToAddModal = `<img src="${response.message.imageUrl}">`;
            $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
            }
        });
})
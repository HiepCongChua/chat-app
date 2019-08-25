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
    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid",targetId);
    if ($(this).hasClass('chat-in-group')) {
        messageFormData.append("isChatGroup",true);
    }
    $.ajax({
        url: "/message/add-message-image",
        type: "post",
        cache: false,
        contentType: false,
        processData: false,
        data: messageFormData,
        success: function(data) {
            console.log("this is data",data);
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
}
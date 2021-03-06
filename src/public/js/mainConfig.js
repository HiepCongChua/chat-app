const socket = io();
function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
};

function nineScrollRight(divId) {
  $(`.right .chat[data-chat=${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat=${divId}]`).scrollTop($(`.right .chat[data-chat=${divId}]`)[0].scrollHeight);
};

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function (editor, event) {
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click:function(){
        textAndEmojiChat(divId);
        typingOn(divId);
      },
      blur:function(){
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function (event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
};

function spinLoaded() {
  $('.main-loader').css('display', 'none');
};

function spinLoading() {
  $('.main-loader').css('display', 'block');
};
function showModalWhenNotYetConversations(){
  if(!$("ul.people").find("a").length){
    Swal.fire({//Biến swal sử dụng trong thư viện sweetalert2
      title: `Chúng tôi nhận thấy bạn liên hệ nào trong danh bạ ? Hãy tìm kiếm bạn bè để trò chuyện với mọi người.`,
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2ECC71',
      cancelButtonColor: '#ff7675',
      confirmButtonText: 'Tìm kiếm ngay !',
      cancelButtonText: 'Bỏ qua'
    }).then((result) => {
              $('#contactsModal').modal('show');
    });
  }
};
function userTalk(){
  $('div.user-talk').unbind('click').on('click',function(){
    const dataChat = $(this).data('uid');
    $('ul.people').find(`a[href="#uid_${dataChat}"]`).click();
    $(this).closest('div.modal').modal('hide');
  });
}
// function ajaxLoading() {
//   $(document)
//     .ajaxStart(function () {
//       spinLoading();
//     })
//     .ajaxStop(function () {
//       spinLoaded();
//     });
// }

function showModalContacts() {
  $('#show-modal-contacts').click(function () {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function () {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $('.main-content').click(function () {
    $('#notifications').fadeOut('fast', 'linear');
  });
};
function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click",function(){
      const href = $(this).attr("href");
      const modalImageId = href.replace("#",'');
      const originDataImage = $(`#${modalImageId}`).find("div.modal-body").html();
      let countRows = Math.ceil($(`#${modalImageId}`).find('div.all-images>img').length / layoutNumber);
      let layoutStr = new Array(countRows).fill(layoutNumber).join("");
      $(`#${modalImageId}`).find('div.all-images').photosetGrid({
        highresLinks: true,
        rel: 'withhearts-gallery',
        gutter: '2px',
        layout: layoutStr,
        onComplete: function () {
        $(`#${modalImageId}`).find('.all-images').css({
            'visibility': 'visible'
          });
          $(`#${modalImageId}`).find('.all-images a').colorbox({
            photo: true,
            scalePhotos: true,
            maxHeight: '90%',
            maxWidth: '90%'
          });
        } 
      });
       //Bắt sự kiện đóng modal
       $(`#${modalImageId}`).on('hidden.bs.modal  ', function () {
          $(this).find("div.modal-body").html(originDataImage);
      });
  });

  // let countRows = Math.ceil($('#imagesModal').find('div.all-images>img').length / layoutNumber);
  // let layoutStr = new Array(countRows).fill(layoutNumber).join("");
  // $('#imagesModal').find('div.all-images').photosetGrid({
  //   highresLinks: true,
  //   rel: 'withhearts-gallery',
  //   gutter: '2px',
  //   layout: layoutStr,
  //   onComplete: function () {
  //     $('.all-images').css({
  //       'visibility': 'visible'
  //     });
  //     $('.all-images a').colorbox({
  //       photo: true,
  //       scalePhotos: true,
  //       maxHeight: '90%',
  //       maxWidth: '90%'
  //     });
  //   }
  // });
}
function bufferToBase64 (buffer){
  return btoa(
       new Uint8Array(buffer)
         .reduce((data, byte) => data + String.fromCharCode(byte), '')
     );
} 

function flashMasterNotify() {
  const notify = $('.master-success-message').text();
  if (notify.length) {
    alertify.notify(notify, "success", 7);
  }
};
function changeTypeChat() {
  $("#select-type-chat").bind("change", function () {
    const optionSelected = $("option:selected", this);
    optionSelected.tab("show");
    if ($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    }
    else {
      $(".create-group-chat").show();
    }
  });
};
function changeScreenChat() {
  $('.room-chat').unbind("click").on("click", function () {
    let divId = $(this).find("li").data('chat');
    $('.person').removeClass('active');
    $(`.person[data-chat=${divId}]`).removeClass('active');
    $(this).find("li").addClass("active");
    $(this).tab('show');
    //Cấu hình thanh cuộn bên rightSide
    
    nineScrollRight(divId);
    enableEmojioneArea(divId);
    imageChat(divId);
    attachmentChat(divId);
    videoChat(divId);
  });
};
function convertEmoji(){
  $(".convert-emoji").each(function() {
    var original = $(this).html();
    var converted = emojione.toImage(original);
    $(this).html(converted);
});
};
function resizeNineScrollLeft(){
  $(".left").getNiceScroll().resize();
}
$(document).ready(function () {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();
  // nineScrollRight();

  // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn

  // Icon loading khi chạy ajax
  // ajaxLoading();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  flashMasterNotify();

  changeTypeChat();
  changeScreenChat();
  if( $('ul.people').find("a").length){
   $('ul.people').find("a")[0].click();
  }
  convertEmoji();
  $("#video-chat-group").bind("click",function(){
    alertify.notify("Tính năng không khả dụng với nhóm trò chuyện","error",7);
  });
  showModalWhenNotYetConversations();
  userTalk();
});  

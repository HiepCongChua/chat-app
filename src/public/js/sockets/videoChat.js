function videoChat(divId){
  $(`#video-chat-${divId}`).unbind("click").on("click",function(){
   const targetId = $(this).data("chat");
   const callerName = $("#navbar-username").text();
   const dataToEmit = {
       listenerId:targetId,
       callerName,
   }
   socket.emit("check-listener-online",dataToEmit);//B1:Check xem user có online không 
  });
}



$(document).ready(function(){
  socket.on("listener-offline",function(){
     alertify.notify("Người dùng hiện tại đang offl");
     return false;
  });

  let getPeerId = "";
  const peer = new Peer();
  peer.on("open",function(peerId){
    getPeerId = peerId;
  });
  socket.on('server-request-peer-id-of-listener',(response)=>{//lắng nghe sự kiện yêu cầu peerId của client.
  const dataToEmit = {
    callerId:response.callerId,
    listenerId:response.listenerId,
    callerName:response.callerName,
    listenerName :  $("#navbar-username").text(),
    listenerPeerId : getPeerId
  };
  socket.emit("listener-emit-peer-id-to-server",dataToEmit);//bắn sự kiện cho server đi kèm là perrId

  });
  
  //Config với vai trò user là caller
  socket.on('server-send-peer-id-of-listener-to-caller',(response)=>{
    const dataToEmit = {//Nhận được peerId của listener
      callerId:response.callerId,
      listenerId:response.listenerId,
      callerName:response.callerName,
      listenerName :  response.listenerName,
      listenerPeerId : response.listenerPeerId
    };
    socket.emit("caller-request-call-to-server",dataToEmit);//Sau khi đã nhận được peerId của listener thì caller tiếp tục bắn sự kiện cho listener
    let timerInterval;
    Swal.fire({
      title: `Đang gọi cho &nbsp;<span style="color:#2ECC71;">${response.listenerName}</span>&nbsp;<i class="fa fa-volume-control-phone"></i>`,
      html:`
      Thời gian: <strong style="color:#d43f3a;">giây</strong><br/><br/><button id="btn-cancel-call" class="btn btn-danger">
      Hủy cuộc gọi
      </button>
      `,
      backdrop:"rgba(85,85,85,0.4)",
      width:"52rem",
      allowOutsideClick:false,
      showConfirmButton: false,
      timer: 30000,
      onBeforeOpen:()=>{
        $("#btn-cancel-call").unbind("click").on("click",function(){
            Swal.close();
            clearInterval(timerInterval);
            socket.emit("caller-cancel-request-call-to-server",dataToEmit);//Caller hủy cuộc gọi.
        });
        Swal.showLoading();
        timerInterval = setInterval(()=>{
           Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
        },1000); 
      },
      onOpen:()=>{
       socket.on("server-send-reject-call-to-caller",(response)=>{//Caller nhận được sự kiện từ chối cuộc gọi từ listener
        Swal.close();
        clearInterval(timerInterval);
        Swal.fire({
          type:"info",
          title:`<span style="color:#2ECC71;" >${response.listenerName}</span> &nbsp; đã từ chối cuộc gọi của bạn.`,
          backdrop:"rgba(85,85,85,0.4)",
          width:"60rem",
          allowOutsideClick:false,
          confirmButtonColor: '#2ECC71',
          confirmButtonText: 'Xác nhận ',
        });
       });

       socket.on("server-send-accept-call-to-caller",response=>{
        Swal.close();
        clearInterval(timerInterval);
        console.log("Listener accept !!");
       });
      },
      onClose:()=>{
        clearInterval(timerInterval);
      }
    }).then((result)=>{
        return false;
    });

    });

  //Config với vai trò user là listener
  socket.on("server-send-request-to-caller",(response)=>{//listener nhận được yêu cầu cuộc gọi từ caller (hiển thị lên modal);
    const dataToEmit = {
      callerId:response.callerId,
      listenerId:response.listenerId,
      callerName:response.callerName,
      listenerName :  $("#navbar-username").text(),
      listenerPeerId : getPeerId
    };
    let timerInterval;
    Swal.fire({
      title: `Bạn có cuộc gọi video từ &nbsp;<span style="color:#2ECC71;">${response.callerName}</span>&nbsp;<i class="fa fa-volume-control-phone"></i>`,
      html:`
      Thời gian: <strong style="color:#d43f3a;">giây</strong><br/><br/><button id="btn-reject-call" class="btn btn-danger">
      Từ chối
      </button>
      <button id="btn-accept-call" class="btn btn-success">
      Đồng ý
      </button>
      `,
      backdrop:"rgba(85,85,85,0.4)",
      width:"52rem",
      allowOutsideClick:false,
      showConfirmButton: false,
      timer: 30000,
      onBeforeOpen:()=>{
        $("#btn-reject-call").unbind("click").on("click",function(){//Listener không đồng ý hủy yêu cầu cuộc gọi từ caller
            Swal.close();
            clearInterval(timerInterval);
           socket.emit("listener-reject-request-caller",dataToEmit);
        });
        $("#btn-accept-call").unbind("click").on("click",function(){//Listener đồng ý với yêu cầu cuộc gọi của caller
          Swal.close();
          clearInterval(timerInterval);
         socket.emit("listener-accept-request-caller",dataToEmit);
      });
        Swal.showLoading();
        timerInterval = setInterval(()=>{
           Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
        },1000);
      },
      onOpen:()=>{
           socket.on("server-send-cancel-request-to-caller",function(){//listener nhận được sự kiện hủy yêu cầu cuộc gọi từ caller
            Swal.close();
            clearInterval(timerInterval);
           });
           socket.on("server-send-accept-call-to-listener",function(response){//Sự kiện chính bản thân listener đồng ý với yêu cầu cuộc gọi từ caller
            Swal.close();
            clearInterval(timerInterval);
            console.log("I am readyyyyy!!");
           });
      },
      onClose:()=>{
        clearInterval(timerInterval);
      }
    }).then((result)=>{
        return false;
    });
  });
  $("#btn-cancel-call").unbind("click");
  // $(`#video-chat-${divId}`).unbind("click");
});
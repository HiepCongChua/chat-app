import _ from 'lodash';
import { removeSocketIdFromArray, pushSocketIdToArray, emitNotifyToArray } from './../../helpers/socket';
const chatVideo = (io) => {//Trước hết giả sử người A (userId) gửi lời mời cho người B (contactId) 
  let clients = {};
  io.on('connection', (socket) => {
    if (socket.request.user.chatGroupIds) {
      const currentUserId = socket.request.user._id; //Lấy id của user hiện tại 
      clients = pushSocketIdToArray(clients, currentUserId, socket.id)//Lấy mảng các user
      socket.request.user.chatGroupIds.forEach(group => {//chatGroupIds là một mảng các id của group mà user nằm trong.
        clients = pushSocketIdToArray(clients, group._id, socket.id);
      });
      socket.on("check-listener-online", (data) => {//Server nhận được sự kiện từ client gửi lên
        if(clients[data.listenerId]){//Nếu tồn tại user thì online
             const response = {//Tạo biến response 
                 callerId:socket.request.user._id,
                 listenerId:data.listenerId,
                 callerName:data.callerName
             }
             emitNotifyToArray(clients,data.listenerId,io,"server-request-peer-id-of-listener",response);//bắn sự kiện này về cho client yêu cầu một peerId (một thư viện dùng để call video)
        }
        else {
            socket.emit("listener-offline");//Nếu không tồn tại socketIo thì user đang offline lúc này bắn sự kiện về cho 
        }
      });
      socket.on("listener-emit-peer-id-to-server", (data) => {//Server nhận được sự kiện từ phía listener gửi lên peerId
        const response = {//tạo biến response để  gửi cho caller
            callerId:data.callerId,
            listenerId:data.listenerId,
            callerName:data.callerName,
            listenerName :  data.listenerName,
            listenerPeerId : data.listenerPeerId
        };
        if(clients[data.callerId]){
            emitNotifyToArray(clients,data.callerId,io,"server-send-peer-id-of-listener-to-caller",response);//bắn sự kiện kèm dữ liệu của listener về cho caller        
        }
      });
      socket.on("caller-request-call-to-server", (data) => {//Server nhận được sự kiện từ phía caller (sự kiện yều cầu cuộc gọi  cho listener)
        const response = {//tạo biến response để  gửi cho listener
            callerId:data.callerId,
            listenerId:data.listenerId,
            callerName:data.callerName,
            listenerName :  data.listenerName,
            listenerPeerId : data.listenerPeerId
        };
        if(clients[data.listenerId]){
            emitNotifyToArray(clients,data.listenerId,io,"server-send-request-to-caller",response);//bắn sự kiện kèm dữ liệu của caller về cho listener        
        }
      });
      socket.on("caller-cancel-request-call-to-server", (data) => {//Server nhận được sự kiện từ phía caller (sự kiện yều cầu cuộc gọi nhưng đang gọi thì caller hủy cuộc gọi cho listener)
        const response = {//tạo biến response để  gửi cho listener
            callerId:data.callerId,
            listenerId:data.listenerId,
            callerName:data.callerName,
            listenerName :  data.listenerName,
            listenerPeerId : data.listenerPeerId
        };
        if(clients[data.listenerId]){
            emitNotifyToArray(clients,data.listenerId,io,"server-send-cancel-request-to-caller",response);//bắn sự kiện kèm dữ liệu của caller về cho listener        
        }
      });
      socket.on("listener-reject-request-caller", (data) => {//listener từ chối yêu cầu cuộc gọi với caller, bắn sự kiện về cho caller
        const response = {
            callerId:data.callerId,
            listenerId:data.listenerId,
            callerName:data.callerName,
            listenerName :  data.listenerName,
            listenerPeerId : data.listenerPeerId
        };
        if(clients[data.callerId]){
            emitNotifyToArray(clients,data.callerId,io,"server-send-reject-call-to-caller",response);       
        }
      });
      socket.on("listener-accept-request-caller", (data) => {//listener đồng ý yêu cầu cuộc gọi với caller, bắn sự kiện về cho caller
        const response = {
            callerId:data.callerId,
            listenerId:data.listenerId,
            callerName:data.callerName,
            listenerName :  data.listenerName,
            listenerPeerId : data.listenerPeerId
        };
        if(clients[data.callerId]){
            emitNotifyToArray(clients,data.callerId,io,"server-send-accept-call-to-caller",response);       
        }
        if(clients[data.listenerId]){
          emitNotifyToArray(clients,data.listenerId,io,"server-send-accept-call-to-listener",response);       
      }
      });
      socket.on('disconnect', () => {//Trong trường hợp người dùng F5 hoặc đóng tab thì xóa socketId đại diện cho tab vừa đóng trong mảng đi
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket.id);
      });
    });
    }
  });
};
export {
    chatVideo
}
import _ from 'lodash';
import { removeSocketIdFromArray, pushSocketIdToArray, emitNotifyToArray } from './../../helpers/socket';
const chatAttachment = (io) => {//Trước hết giả sử người A (userId) gửi lời mời cho người B (contactId) 
  let clients = {};
  io.on('connection', (socket) => {//Mỗi lần có một user kết nối đến server thì callback lại được invoked tạo ra một socketId để quản lý người dùng đó.
    if (socket.request.user.chatGroupIds) {
      const currentUserId = socket.request.user._id; //Lấy id của user hiện tại 
      clients = pushSocketIdToArray(clients, currentUserId, socket.id)//Lấy mảng các user
      socket.request.user.chatGroupIds.forEach(group => {//chatGroupIds là một mảng các id của group mà user nằm trong.
        clients = pushSocketIdToArray(clients, group._id, socket.id);
      });
      socket.on("chat-message-attachment", (data) => {//Server nhận được sự kiện từ client gửi lên
        console.log(data);
        if (data.groupId) {
          const response = {
            currentGroupId: data.groupId,
            currentUserId: socket.request.user._id,
            message: data.message
          };
          if (clients[data.groupId].length>0) {
            emitNotifyToArray(clients, data.groupId, io, 'response-chat-message-attachment', response);
          };
        }
       else if (data.contactId) {
          const response = {
            currentUserId: socket.request.user._id,
            message: data.message
          };
          if (clients[data.contactId]) {
            emitNotifyToArray(clients, data.contactId, io, 'response-chat-message-attachment', response);
          };
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
    chatAttachment
}
import _ from 'lodash';
import { removeSocketIdFromArray, pushSocketIdToArray, emitNotifyToArray } from './../../helpers/socket';
const chatTextEmoji = (io) => {//Trước hết giả sử người A (userId) gửi lời mời cho người B (contactId) 
  let clients = {};
  io.on('connection', (socket) => {
    if (socket.request.user.chatGroupIds) {
      const currentUserId = socket.request.user._id; //Lấy id của user hiện tại 
      clients = pushSocketIdToArray(clients, currentUserId, socket.id)//clients là một object với mỗi key của object là id của user và giá trị của key này là một mảng các socketId (trong trường hợp user này đăng nhập ở nhiều thiết bị);
      socket.request.user.chatGroupIds.forEach(group => {//chatGroupIds là một mảng các id của group mà user nằm trong.
        clients = pushSocketIdToArray(clients, group._id, socket.id);
      });
      socket.on("chat-text-emoji", (data) => {//Server nhận được sự kiện từ client gửi lên
        if (data.groupId) {
          const response = {
            currentGroupId: data.groupId,
            currentUserId: socket.request.user._id,
            message: data.message
          };
          if (clients[data.groupId].length>0) {
            emitNotifyToArray(clients, data.groupId, io, 'response-chat-text-emoji', response);
          };
        }
       else if (data.contactId) {
          const response = {
            currentUserId: socket.request.user._id,
            message: data.message
          };
          if (clients[data.contactId]) {
            emitNotifyToArray(clients, data.contactId, io, 'response-chat-text-emoji', response);
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
  chatTextEmoji
}
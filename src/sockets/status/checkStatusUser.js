import _ from 'lodash';
import { removeSocketIdFromArray, pushSocketIdToArray, emitNotifyToArray } from './../../helpers/socket';
const checkStatusUser = (io) => {//Trước hết giả sử người A (userId) gửi lời mời cho người B (contactId) 
  let clients = {};
  io.on('connection', (socket) => {
    if (socket.request.user.chatGroupIds) {
      const currentUserId = socket.request.user._id; //Lấy id của user hiện tại 
      clients = pushSocketIdToArray(clients, currentUserId, socket.id)//Lấy mảng các user
      socket.request.user.chatGroupIds.forEach(group => {//chatGroupIds là một mảng các id của group mà user nằm trong.
        clients = pushSocketIdToArray(clients, group._id, socket.id);
      });
      const listUsersOnline = (Object.keys(clients));
      socket.emit("server-send-list-users-online",listUsersOnline);//Bắn về clien những id của user đang online
      socket.broadcast.emit("server-send-when-new-user-login",socket.request.user._id);
      socket.on('disconnect', () => {//Trong trường hợp người dùng F5 hoặc đóng tab thì xóa socketId đại diện cho tab vừa đóng trong mảng đi
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket.id);
      });
      socket.broadcast.emit("server-send-when-new-user-logout",socket.request.user._id);
    });
    }
  });
};
export {
    checkStatusUser
}
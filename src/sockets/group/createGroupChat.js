import _ from 'lodash';
import { removeSocketIdFromArray, pushSocketIdToArray, emitNotifyToArray } from './../../helpers/socket';
const createGroupChat = (io) => {//Trước hết giả sử người A (userId) gửi lời mời cho người B (contactId) 
  let clients = {};
  io.on('connection', (socket) => {
    if (socket.request.user.chatGroupIds) {
      const currentUserId = socket.request.user._id; //Lấy id của user hiện tại 
      clients = pushSocketIdToArray(clients, currentUserId, socket.id)//Lấy mảng các user
      socket.request.user.chatGroupIds.forEach(group => {//chatGroupIds là một props của clients nó có key là id của group và value của nó là một mảng chứa các socketId , mỗi socketId đại diện cho một user đang hoạt động mà user này là thành viên của group .
        clients = pushSocketIdToArray(clients, group._id, socket.id);
      });
      socket.on("create-group-chat", (data) => {
        let members = [];
        data.groupChat.members.forEach((member)=>{
            members.push(member.userId);
        });
        // clients = pushSocketIdToArray(clients,data.groupChat._id, socket.id);
        for(let userId in clients)
        {
            if(members.includes(userId)){
                clients[userId].forEach(socketId=>{
                    if(socketId!==socket.id){
                      clients = pushSocketIdToArray(clients, data.groupChat._id,socketId);  
                    }
                });
            }
        }
        const response = { 
            groupChat:data.groupChat
        };
        data.groupChat.members.forEach(member=>{
            if(clients[member.userId] && (member.userId !== currentUserId.toString()) ){//Sự kiện chỉ được bắn về user thỏa mãn 2 điều kiện  key đại diện cho Id (userID) tồn tại trong clients và id hiện tại khác với userId trong mảng (tức là không bắn về thằng đã phát ra sự kiện tạo group nữa/)
                emitNotifyToArray(clients,member.userId,io,'response-create-group-chat',response);
            }
        });
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
    createGroupChat
}
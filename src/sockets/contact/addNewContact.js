import _ from 'lodash';
import {removeSocketIdFromArray,pushSocketIdToArray,emitNotifyToArray} from './../../helpers/socket';
const addNewContact = (io)=>{//Trước hết giả sử người A (userId) gửi lời mời cho người B (contactId) 
  let clients = {};
  io.on('connection',(socket)=>{
     const currentUserId = socket.request.user._id ; //Khi mới vào trang đăng nhập thì chưa có request.user.id  
     clients = pushSocketIdToArray(clients,currentUserId,socket.id)
     socket.on("add-new-contact",(data)=>{//Server nhận được sự kiện từ client gửi lên
      const currentUser = {//Khởi tạo đối tượng chứa thông tin của A để gửi cho B
           id:socket.request.user._id,
           username:socket.request.user.username,
           avatar:socket.request.user.avatar
         };
         if(clients[data.contactId])//Trường hợp này sử lý nếu người dùng B đăng nhập ở nhiều thiết bị thì sẽ có nhiều thiết bị sẽ đồng thời nhận được thông báo
         {
            emitNotifyToArray(clients,data.contactId,io,'response-add-new-contact',currentUser);
         }
     });
     socket.on('disconnect',()=>{//Trong trường hợp người dùng F5 hoặc đóng tab thì xóa socketId đại diện cho tab vừa đóng trong mảng đi
        clients =  removeSocketIdFromArray(clients,currentUserId,socket);
     });
     console.log("socket",clients);
  });
};
export   {
    addNewContact
}
import _ from 'lodash';
import {removeSocketIdFromArray,pushSocketIdToArray,emitNotifyToArray} from '../../helpers/socket';
const removeRequestContactSent = (io)=>{//Trước hết giả sử người A (userId) gửi lời mời cho người B (contactId) 
  let clients = {};
  io.on('connection',(socket)=>{
     const currentUserId = socket.request.user._id;     
     clients = pushSocketIdToArray(clients,currentUserId,socket.id);
     socket.on("remove-request-contact-sent",(data)=>{//Server nhận được sự kiện từ client gửi lên
      const currentUser = {//Khởi tạo đối tượng chứa thông tin của A để gửi cho B
           id:socket.request.user._id
         };
         if(clients[data.contactId])//Trường hợp này sử lý nếu người dùng B đăng nhập ở nhiều tab thì sẽ tất cả các tab sẽ đồng thời nhận được thông báo
         {
            emitNotifyToArray(clients,data.contactId,io,'response-remove-request-contact-sent',currentUser);
         }
     });
     socket.on('disconnect',()=>{ //Trong trường hợp người dùng F5 hoặc đóng tab thì xóa socketId đại diện cho tab vừa đóng trong mảng đi
       clients =  removeSocketIdFromArray(clients,currentUserId,socket);
     });
  }); 
};
export {
    removeRequestContactSent
}
import {addNewContact} from './contact/addNewContact';//Add socket vào một thư mực riêng trên server chỉ để xử lý phần socket.
import {removeRequestContactSent} from './contact/removeRequestContactSent';
import {removeRequestContactReceived} from './contact/removeRequestContactReceived';
import {acceptRequestContactReceived} from './contact/acceptRequestContactReceived';
import {removeContact} from './contact/removeContact';
import {chatTextEmoji} from './chat/chatAndTextEmoji';
const initSockets = (io)=>{
    addNewContact(io);//A gửi lời mời kết bạn cho B
    removeRequestContactSent(io);//Sự kiện A gửi cho B lời mời kết bạn rồi lại hủy
    removeRequestContactReceived(io);
    acceptRequestContactReceived(io);
    removeContact(io);
    chatTextEmoji(io);
}
export  {
  initSockets
}
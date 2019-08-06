import {addNewContact} from './contact/addNewContact';//Add socket vào một thư mực riêng trên server chỉ để xử lý phần socket.
import {removeRequestContact} from './contact/removeRequestContact';
const initSockets = (io)=>{
    addNewContact(io);//A gửi lời mời kết bạn cho B
    removeRequestContact(io);//Sự kiện A gửi cho B lời mời kết bạn rồi lại hủy
}
export  {
  initSockets
}
import {addNewContact} from './contact/addNewContact';
const initSockets = (io)=>{
    addNewContact(io);
}
export  {
  initSockets
}
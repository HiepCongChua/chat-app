
import moment from 'moment';
export let bufferToBase64 = (buffer)=>{
    return Buffer.from(buffer).toString("base64");
}
export let lastItemOfArray = (array)=>{
    if(!array)
    {
      return {
        messageType:'none'
      }   
    }
   else if(array.length===0)
   {
    return {
        messageType:'none'
      }  
   }
   else if(array.length>0){
      return array[array.length-1];
    }
}
export let convertTimestampToHumanTime = (timestamp)=>{
  if(!timestamp){
      return ""
  };
  return moment(timestamp).locale("vi").startOf('seconds').fromNow();
};

{/* <img
src="data:<%=message.file.contentType%>;base64,<%= bufferToBase64(message.file.data) %>"
class="show-image-chat" title="<%= message.sender.name %>"
/> */}
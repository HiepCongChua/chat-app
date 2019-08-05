const addNewContact = (io)=>{
  io.on('connection',(socket)=>{
     socket.on("add-new-contact",(data)=>{//Server nhận được sự kiện từ client gửi lên
         console.log("this is data",data);
         console.log("this is user",socket.request.user);
     });
  })
};
export   {
    addNewContact
}
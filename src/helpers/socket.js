import _ from 'lodash';
const pushSocketIdToArray = (clients, userId, socketId) => {
    if (clients[userId]) {//Sử dụng mô hình lưu với id là key (userId) và 
        // giá trị là mảng các id của socket (mỗi lần kết nối socket sẽ tạo ra một id mới và được đẩy vào mảng)
        clients[userId] = [...clients[userId], socketId];
    } else {
        clients[userId] = [socketId];
        //Nếu trong lần đầu kết nối mà mảng currentUserId chưa tồn tại thì khởi tạo và đẩy vào phần tử là socketId
    };
    return clients;
};
const emitNotifyToArray = (clients, userId, io, eventName, data) => {
    clients[userId].forEach(socketId => {//mỗi socketId đại 
        // console.log("This is socket",io.sockets.connected[socketId]);
        if(io.sockets.connected[socketId]){
             return io.sockets.connected[socketId].emit(eventName, data);
        }
        //Khi nhấn button thì nó sẽ gửi thông báo đến những tab mà người được nhận sự kiện đang đăng nhập
    });
}; 
const removeSocketIdFromArray = (clients, userId, socket) => {
    clients[userId] = clients[userId].filter((socketId) => {
        return socketId !== socket.id;
    });
    if ((clients[userId].length === 0))
    //Khi user đóng tap mà mảng chứa các socketId (đại diện cho mỗi connect rỗng) thì xóa mảng này đi.
    //Nhưng phát sinh trường hợp là khi người dùng đăng xuất mà không đóng tab thì không bắt được (dẫn đến mảng rỗng vẫn tồn tại trên server).
    //Trong trường hợp mảng rỗng thì xóa thuộc tính userId đi
    {
        _.omit(clients, [userId]);
    }
    return clients;

};

export {
    pushSocketIdToArray,
    emitNotifyToArray,
    removeSocketIdFromArray
}
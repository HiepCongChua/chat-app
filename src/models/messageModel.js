    
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    senderId:String,
    receiverId:String,
    conversationType:String,
    messageType:String,
    sender:{
     id:String,
     name:String,
     avatar:String
    },
    receiver:{
      id:String,
      name:String,
      avatar:String
    },
    text:String,
    file:{data:Buffer,contentType:String,fileName:String},
    imageUrl:{
        type:String,default:null
    },
    createdAt:{
        type:Number,default:Date.now
    },
    updatedAt:{
        type:Number,default:null
    },
    deletedAt:{
        type:Number,default:null
    }
});
MessageSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    getMessagesInPersonal(senderId,receiverId,limit){//Nếu sắp xếp createdAt =1 thì sẽ khoongp hù hợp do sắp xếp kiểu này lúc lấy limit nó sẽ lấy từ tin nhắn đầu tiên (cũ nhất) mà yêu cầu là lấy tin nhắn mới nhất trở về trước => Lấy tin nhắn theo thứ tự từ mới nhất đến cũ nhất dựa vào trường createAt 
        return this.find({
         $or:[
          {$and:[{senderId},{receiverId}]},
          {$and:[{senderId:receiverId},{receiverId:senderId}]}
         ]
        }).sort({createdAt:-1}).limit(limit).exec();
    },
    getMessagesChatGroup(receiverId,skip,limit){//Nếu sắp xếp createdAt =1 thì sẽ khoongp hù hợp do sắp xếp kiểu này lúc lấy limit nó sẽ lấy từ tin nhắn đầu tiên (cũ nhất) mà yêu cầu là lấy tin nhắn mới nhất trở về trước => Lấy tin nhắn theo thứ tự từ mới nhất đến cũ nhất dựa vào trường createAt 
        return this.find({
            receiverId
        }).sort({createdAt:-1}).skip(skip).limit(limit).exec();
    }
};
const MESSAGE_CONVERSATION_TYPES = {
    PERSONAL:'personal',
    GROUP:'group'
};
const MESSAGE_TYPES = {
 TEXT:"text",
 IMAGE:"image",
 FILE:"file"
};
module.exports =  {
    model:mongoose.model("message",MessageSchema),
    MESSAGE_CONVERSATION_TYPES,
    MESSAGE_TYPES
}
//Mô hình lưu trữ tin nhắn
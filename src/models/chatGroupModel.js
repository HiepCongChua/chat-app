
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ChatGroupSchema = new Schema({
    name: String,
    userAmount: { type: Number, min: 3, max: 100 },
    messageAmount: { type: Number, default: 0 },
    userId: String,
    members: [
        { userId: String }
    ],
    createdAt: {
        type: Number, default: Date.now
    },
    updatedAt: {
        type: Number, default: Date.now
    },
    deletedAt: {
        type: Number, default: null
    }
});
ChatGroupSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    getChatGroups(userId,skip,limit) {//Lấy tất cả các group chat mà userId nằm trong
        return this.find(
            {
                "members.userId": {$in:[userId]}
            }
        ).sort({ updatedAt: -1 }).skip(skip).limit(limit).exec();
    },
    getChatGroupById(_id){
        return this.findOne(
            {
                _id 
            }
        ).exec();
    },
    updateWhenHasNewMessage(_id,amount){
         return this.updateOne(
           {_id},{messageAmount:amount,updatedAt:Date.now()}
         ).exec();
    },
    getChatGroupIdsUser(id){
        return this.find({
           "members.userId" : {$in:[id]}
        },{_id:1}).exec();
    }
}
export default mongoose.model("chat-group", ChatGroupSchema);
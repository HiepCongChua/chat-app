
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
    getChatGroups(userId, limit) {//Lấy tất cả các group chat mà userId nằm trong
        return this.find(
            {
                members: { $elemMatch: { userId } }
            }
        ).sort({ updatedAt: -1 }).limit(limit).exec();
    }
}
export default mongoose.model("chat-group", ChatGroupSchema);
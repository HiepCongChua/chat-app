import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ContactSchema = new Schema({
    userId:String,
    contactId:String,
    status:{type:Boolean,default:false},
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
ContactSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    findAllByUser(id){
        return this.find({//Hàm này tìm những bản ghi thỏa mãn một trong 2 điều kiện userId = id hoặc contactId = id 
            $or:[
                {"userId":id},
                {"contactId":id}
            ]
        }).exec();
    },
    checkExists(userId,contactId)//Kiểm tra xem trong user gửi lời mời kết bạn đã kết bạn hay chưa ?
    {
       return this.findOne({
           $or:[
            {$and:[
                {"userId":userId},
                {"contactId":contactId}
            ]},
            {$and:[
                {"userId":contactId},
                {"contactId":userId}
            ]}
           ]
       })    
    }
}
export default mongoose.model("contact",ContactSchema);
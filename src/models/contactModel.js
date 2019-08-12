import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ContactSchema = new Schema({//Mô hình của bảng contactModel này là khi A kết bạn cho B thì 
    //userId = id(A)
    //contactId = id(B)
    //status là trạng thái hoạt động của B (có hoạt động hoặc không hoạt động)
    userId: String,
    contactId: String,
    status: { type: Boolean, default: false },
    createdAt: {
        type: Number, default: Date.now
    },
    updatedAt: {
        type: Number, default: null
    },
    deletedAt: {
        type: Number, default: null
    }
});
ContactSchema.statics = {//Tạo một contact mới
    createNew(item) {
        return this.create(item);
    },
    findAllByUser(id) {
        return this.find({//Hàm này tìm những bản ghi thỏa mãn một trong 2 điều kiện userId = id hoặc contactId = id 
            //Ví dụ như người dùng A query thì nó sẽ tìm những bản ghi nào mà thỏa mãn một trong 2 vai trò
            // A là người thêm X vào danh sách kết bạn (A=>userID,X=>contactID)
            // A là người được X kết bạn (A=>contactID,X=>userID)
            $or: [
                { "userId": id },
                { "contactId": id }
            ]
        }).exec();
    },
    checkExists(userId, contactId)//Kiểm tra xem trong user gửi lời mời kết bạn đã kết bạn hay chưa ?
    //Tìm kiếm bản ghi thỏa mãn một trong 2 điều kiện 
    //A gửi yêu cầu cho B (A=>userId,B=>contactId)
    //B gửi yêu cầu cho A (B=>userId,A=>contactID)
    {
        return this.findOne({
            $or: [
                {
                    $and: [
                        { "userId": userId },
                        { "contactId": contactId }
                    ]
                },
                {
                    $and: [
                        { "userId": contactId },
                        { "contactId": userId }
                    ]
                }
            ]
        }).exec();
    },
    getContacts(id, skip ,limit) {
        console.log(limit,skip);
        return this.find({
            $and: [
                {
                    $or:[{userId:id},{contactId:id}]
                },
                { status: true }
            ]
        }).sort({createdAt:-1}).skip(skip).limit(limit).exec();
    },
    getContactsReceive(id,skip,limit) {//Lấy những user gửi cho mình lời mời kết bạn
        //=> mình đóng vai trò là contactId
        return this.find({
            $and: [
                { contactId: id },
                { status: false }
            ]
        }).sort({ "createdAt": -1 }).skip(skip).limit(limit).exec();
    },
    getContactsSent(id,skip,limit) {//Lấy những user mình đã gửi request (chưa đồng ý với lời mời của mình )
        //=> mình đóng vai trò là userId
        return this.find({
            $and: [
                { userId: id },
                { status: false }
            ]
        }).sort({ "createdAt": -1 }).skip(skip).limit(limit).exec();
    },
    removeRequestContactSent(userId, contactId) {
        this.remove({
            $and: [
                { userId },
                { contactId }
            ]
        }).exec();
    },
    countAllContacts(id){//Lấy số lượng trong danh bạ của mình 
        return this.count({
            $and: [
                {
                    $or:[{userId:id},{contactId:id}]
                },
                { status: true }
            ]
        }).sort({ "createdAt": -1 }).exec();
    },
    countAllContactsReceive(id){//Lấy số lượng danh sách những người đã gửi lời mời kết bạn cho mình
        return this.count({
            $and: [
                { contactId: id },
                { status: false }
            ]
        }).exec();
    },
    countAllContactsSent(id){//Lấy số lượng những người mình đã gửi lời mời kết bạn
        return this.count({
            $and: [
                { userId: id },
                { status: false }
            ]
        }).exec();
    },
    removeRequestContactReceived(userId,contactId){
        this.remove({
            $and: [
                { userId : contactId },
                { contactId : userId }
            ]
        }).exec(); 
    }
};
export default mongoose.model("contact", ContactSchema);
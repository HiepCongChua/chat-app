
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const  LIMIT_NUMBER_TAKEN = 2;
const NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  content: String,
  isRead: { type: Boolean, default: false },
  createdAt: {
    type: Number, default: Date.now
  }
});
NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequestContactNotification(senderId, receiverId, type) {
    return this.remove({
      $and: [
        { senderId },
        { receiverId },
        { type }
      ]
    }).exec();
  },
  getByUserIdAndLimit(userId, limit) {//Fetch các thông báo từ sever cho client (giới hạn số lượng thông báo trong mỗi fetch)
    return this.find({
      "receiverId": userId//user đứng từ receiver để load  
    }).sort({ "createdAt": -1 }).limit(LIMIT_NUMBER_TAKEN).exec();
  },
  notifcationsUnread(id){//Đếm số lượng thông báo chưa đọc
     return this.count({
       $and:[
         {receiverId:id},
         {isRead:false}
       ]
     }).exec();
  },
  readMore(userId,skip,limit){//nhiệm vụ giống với phân trang
    return this.find({
      "receiverId": userId//user đứng từ receiver để load  
    }).sort({ "createdAt": -1 }).skip(skip).limit(LIMIT_NUMBER_TAKEN).exec();
  },
  markAllAsRead(userId,targetUserId){//tham số đầu vào là userId (user hiện tại) targetUserID là mảng những sender
    console.log(targetUserId);
    targetUserId = targetUserId.map(s=>mongoose.Types.ObjectId(s));
    console.log(targetUserId.toString());
    return this.updateMany(
      {$and:[
        {
            receiverId:userId
        },
        {
            senderId:{
                $in:targetUserId
                }
        }
        ]
    }
    ,
    {$set: { isRead: true }}
    ).exec();
  }
};
const NOTIFICATION_TYPES = {
  ADD_CONTACT: 'add_contact'
};
const NOTIFICATION_CONTENTS = {
  getContent: (notificationType, isRead, userId, username, userAvatar) => {
    if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
      let img = ''
      if (!userAvatar) {
        img = `<img class="avatar-small" src="
        https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png
         "
         `
      }
      else {
        img = `<img class="avatar-small" src="${userAvatar}" alt="">`
      }
      if (!isRead) {
        return `
            <div class="notif-readed-false" data-uid="${userId}">
            ${img}
            <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
            </div>
               `;
      }
      return `
            <div data-uid="${userId}">
            ${img}
            <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
            </div>
            `;
    }
  }
}
module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  content: NOTIFICATION_CONTENTS
}

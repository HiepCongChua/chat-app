
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
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
    }).sort({ "createdAt": -1 }).limit().exec();
  }
};
const NOTIFICATION_TYPES = {
  ADD_CONTACT: 'add_contact'
}
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
   <span class="notif-readed-false" data-uid="${userId}">
  ${img}
  <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
</span><br><br><br>
  `;
      }
      return `
      <span data-uid="${userId}">
     ${img}
     <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
   </span><br><br><br>
     `;



    }
  }
}
module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  content: NOTIFICATION_CONTENTS
}

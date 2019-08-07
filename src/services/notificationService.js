import { model as Notification, types, content } from './../models/notificationModel';
import UserModel from './../models/userModel';
const getNotifications = (currentUserId, limit = 3) => {
    return new Promise(async (resolve, rejects) => {
        try {
            const notifications = await Notification.getByUserIdAndLimit(currentUserId, limit);
            const getNotifiContents = await Promise.all(notifications.map(async (noti) => {
                let sender = await UserModel.findUserById(noti.senderId);
                return content.getContent(noti.type, noti.isRead, sender._id, sender.username, sender.avatar)
            }));
            //Đây là một mảng chứa conten do notificationModel render ra.
            //Bắn mảng này cho home-controller xử lý để lúc mới đăng nhập thì nó sẽ đẩy thông báo về.
            return resolve(getNotifiContents);
        } catch (error) {
            return rejects(error);
        };
    });
};
const countNotifUnread = currentUserId => {//Đếm số lượng thông báo chưa đọc
    return new Promise(async (resolve, rejects) => {
        try {
          const notifcationsUnread = await Notification.notifcationsUnread(currentUserId);
          console.log(notifcationsUnread);
          resolve(notifcationsUnread);//Đẩy promise về phía controller
        } catch (error) {
            return rejects(error);
        };
    });
};
export {
    getNotifications,
    countNotifUnread
}
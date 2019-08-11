import { model as Notification, types, content } from './../models/notificationModel';
const LIMIT_NOTIFICATION = 3;
import UserModel from './../models/userModel';
const getNotifications = (currentUserId, LIMIT_NOTIFICATION) => {
    return new Promise(async (resolve, rejects) => {
        try {
            const notifications = await Notification.getByUserIdAndLimit(currentUserId, LIMIT_NOTIFICATION);
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
            resolve(notifcationsUnread);//Đẩy promise về phía controller
        } catch (error) {
            return rejects(error);
        };
    });
};
const readMore = (currentUserId, skip) => {//Hàm load thêm thông báo trong modalNotification.
    return new Promise(async (resolve, rejects) => {
        try {
            const notifications = await Notification.readMore(currentUserId, skip, LIMIT_NOTIFICATION);
            const getNotifiContents = await Promise.all(notifications.map(async (noti) => {
                let sender = await UserModel.findUserById(noti.senderId);
                return content.getContent(noti.type, noti.isRead, sender._id, sender.username, sender.avatar)
            }));
            //Đây là một mảng chứa conten do notificationModel render ra.
            return resolve(getNotifiContents); //Bắn mảng này cho NotificationController xử lý.
        } catch (error) {
            return rejects(error);
        };
    });
};
const markAllAsRead = (currentUserId, targetUserId) => {
    return new Promise(async (resoleve, rejects) => {
        try {
            const notifications = await Notification.markAllAsRead(currentUserId, targetUserId);
            resoleve(notifications);
        } catch (error) {
            console.log(error);
            rejects(error);
        }
    })
}
export {
    getNotifications,
    countNotifUnread,
    readMore,
    markAllAsRead
}
import { model as Notification, types , content  } from './../models/notificationModel';
import UserModel from './../models/userModel';
const getNotifications = (currentUserId, limit = 2) => {
    return new Promise(async (resolve, rejects) => {
        try {
            const notifications = await Notification.getByUserIdAndLimit(currentUserId, limit);
            const getNotifiContents = await Promise.all(notifications.map(async(noti)=>{
                let sender = await UserModel.findUserById(noti.senderId);
                return content.getContent(noti.type,noti.isRead,sender._id,sender.username,sender.avatar)
            }));//đây là một mảng chứa conten do notificationModel render ra.
            return resolve(getNotifiContents);
        } catch (error) {
            return rejects(error);
        }
    })
};
export { 
    getNotifications
}
import {
    getNotifications,
    countNotifUnread as countNotifUnreadService,
} from '../services/notificationService';
import {
    getContacts as getContactsService,
    getContactsSent as getContactsSentService,
    getContactReceive as getContactReceiveServive
} from '../services/contactService';
const getHome = async (req, res, next) => {
    const notifications = await getNotifications(req.user._id);//chứa text là những khối div bên trong là những thông tin của thông báo
    const countNotifUnread = await countNotifUnreadService(req.user._id);//số lượng thông báo chưa đọc
    const contacts = await getContactsService(req.user._id);//lấy tất cả các user còn lại trong hệ thống 
    const contactsSent = await getContactsSentService(req.user._id);//lấy những contact đã gửi
    const contactsReceive = await getContactReceiveServive(req.user._id)//lấy những contact đã gửi lời mời kết bạn 
    return res.render('main/home/home', {
        errors: req.flash("errors"),
        success: req.flash("success"),
        user: req.user,
        notifications,//content của tất cả thông báo
        countNotifUnread,//số lượng thông báo 
        contacts,
        contactsSent,
        contactsReceive
    });
};
export {
    getHome
};


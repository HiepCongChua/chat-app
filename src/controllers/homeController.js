import {getNotifications,countNotifUnread as countNotifUnreadService} from '../services/notificationService';
const getHome = async (req, res, next) => {
    const notifications = await getNotifications(req.user._id);//chứa text là những khối div bên trong là những thông tin của thông báo
    const countNotifUnread = await countNotifUnreadService(req.user._id);//số lượng thông báo chưa đọc
    return res.render('main/home/home',{
        errors: req.flash("errors"),
        success: req.flash("success"),
        user:req.user,
        notifications,//content của tất cả thông báo
        countNotifUnread//số lượng thông báo 
    });
};
export default {
    getHome
};


import {getNotifications} from '../services/notificationService';
const getHome = async (req, res, next) => {
    let notifications = await getNotifications(req.user._id);
    return res.render('main/home/home',{
        errors: req.flash("errors"),
        success: req.flash("success"),
        user:req.user,
        notifications

    })
};
export default {
    getHome
};


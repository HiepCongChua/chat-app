import {
    readMore as readMoreService,
    markAllAsRead as markAllAsReadService
} from './../services/notificationService'
const readMore = async (req, res, next) => {
    try {
        const skipNumberNotification = +(req.query.skipNumber);
        const notificaions = await readMoreService(req.user._id, skipNumberNotification);
        return res.status(200).send(notificaions);
    } catch (error) {
        return res.status(500).send(error);
    };
    
};
const markAllAsRead = async (req, res, next) => {
    try {
        const mark = await markAllAsReadService(req.user._id,req.body.targetUsers);
        return res.status(200).send(mark);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    };
};
export {
    readMore,
    markAllAsRead
} 
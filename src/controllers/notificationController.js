import {
    readMore as readMoreService
} from './../services/notificationService'
const readMore = async (req, res, next) => {
    try {
        const skipNumberNotification = +(req.query.skipNumber);
        const notificaions = await readMoreService(req.user._id,skipNumberNotification);
        return res.status(200).send(notificaions);
    } catch (error) {
        return res.status(500).send(error);
    }
};
export {
    readMore
} 
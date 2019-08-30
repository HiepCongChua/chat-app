import {
    getNotifications,
    countNotifUnread as countNotifUnreadService,
} from '../services/notificationService';
import {
    getContacts as getContactsService,
    getContactsSent as getContactsSentService,
    getContactReceive as getContactReceiveServive,
    countAllcontactsReceive as countAllContactsReceiveService,
    countAllcontactsSent as countAllContactsSentService,
    countAllcontacts as countAllContactsService
} from '../services/contactService';
import { bufferToBase64, lastItemOfArray, convertTimestampToHumanTime } from "../helpers/clientHelper";
import { getAllConversationItems as getAllConversationItemsService } from '../services/messageService';
import request from 'request';
const getICETurnServer = () => {
    return new Promise((resolve, reject) => {
        // // Node Get ICE STUN and TURN list
        // let o = {
        //     format: "urls"
        // };
        // let bodyString = JSON.stringify(o);
        // let https = require("https");
        // let options = {
        //     url:"https://global.xirsys.net/_turn/chat-app",
        //     // host: "global.xirsys.net",
        //     // path: "/_turn/chat-app",
        //     method: "PUT",
        //     headers: {
        //         "Authorization": "Basic " + Buffer.from("leminhhiep:e34c349a-c8d4-11e9-9a64-0242ac110003").toString("base64"),
        //         "Content-Type": "application/json",
        //         "Content-Length": bodyString.length
        //     }
        // };
        // request(options,(error,response,body)=>{
        //   if(error){
        //       console.log("Error when get ICE list :"+error);
        //       return reject(error);
        //   }
        //   const bodyJson = JSON.parse(body);
        //   resolve(bodyJson.v.iceServers);
        // });
        resolve([]);
    })
};
const getHome = async (req, res, next) => {
    const notifications = await getNotifications(req.user._id);//chứa text là những khối div bên trong là những thông tin của thông báo
    const countNotifUnread = await countNotifUnreadService(req.user._id);//số lượng thông báo chưa đọc
    const contacts = (await getContactsService(req.user._id)).map((el) => {
        return el[0];
    });//lấy tất cả các user đã là bạn bè (ở trong trường hợp này không hiểu vì sao lại bị mảng lồng mảng)
    const contactsSent = await getContactsSentService(req.user._id);//lấy những contact đã gửi
    const contactsReceive = await getContactReceiveServive(req.user._id)//lấy những contact đã gửi lời mời kết bạn 
    const countAllContacts = (await countAllContactsService(req.user._id))//lấy tất cả các user đã là bạn bè (ở trong trường hợp này không hiểu vì sao lại bị mảng lồng mảng)
    const countAllContactsSent = await countAllContactsSentService(req.user._id);//lấy những contact đã gửi
    const countAllContactsReceive = await countAllContactsReceiveService(req.user._id)//lấy những contact đã gửi lời mời kết bạn 
    const { allConversationWithMessage } = await getAllConversationItemsService(req.user._id);
    const iceServerList = await getICETurnServer();
    return res.render(
        'main/home/home',
        {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user,
            notifications,//content của tất cả thông báo
            countNotifUnread,//số lượng thông báo 
            contacts,
            contactsSent,
            contactsReceive,
            countAllContacts,
            countAllContactsReceive,
            countAllContactsSent,
            allConversationWithMessage,
            bufferToBase64,
            lastItemOfArray,
            convertTimestampToHumanTime,
            iceServerList : JSON.stringify(iceServerList)
        });
};

export {
    getHome
};


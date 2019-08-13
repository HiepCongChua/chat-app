import { validationResult } from "express-validator/check";
import {
    findUserContact as findUsersContactService,
    addNew as addNewService,
    removeRequestContactSent as removeRequestContactSentService,
    readMoreContacts as readMoreContactsService,
    readMoreContactsSent as readMoreContactsSentService,
    readMoreContactsReceived as readMoreContactsReceivedService,
    removeRequestContactReceived as removeRequestContactReceivedService,
    acceptRequestContactReceived as acceptRequestContactReceivedService,
    removeContact as removeContactService
} from "../services/contactService";
const findUsersContact = async (req, res, next) => {
    const errorArr = [];
    const validationErrors = validationResult(req);
    // if (!validationErrors.isEmpty()) {
    //     const errors = Object.values(validationErrors.mapped());
    //     errors.forEach(item => {
    //         errorArr.push(item.msg);
    //     });
    //     return res.status(500).send(errorArr);
    // };
    try {
        const currentUserId = req.user._id;//Lấy id của user hiện tại 
        const keyword = req.params.keyword;
        const users = await findUsersContactService(currentUserId, keyword);//Tìm contact nhưng loại trì user đang hiện tại
        return res.render('main/contact/sections/_findUsersContact', { users });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};
const addNew = async (req, res, next) => {//Đây là hàm có nhiệm vụ add contact (tức là đứng từ người dùng A gửi lời mời kết bạn đến người dùng B)
    try {
        const currentUserId = req.user._id;
        const contactId = req.body.uid;
        const newContact = await addNewService(currentUserId, contactId);//Hàm này ở phía service(truyền cho nó 2 tham số là id của người dùng hiện tại và id của người dùng muốn gửi lời mời kết bạn)
        return res.status(200).send({ success: !!newContact });//(!!newContact kiểm tra xem bản ghi mới có được tạo hay không true or false)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    };
};
const removeRequestContactSent = async (req, res, next) => {//Hàm hủy lời mời kết bạn đã gửi
    try {
        const currentUserId = req.user._id;
        const contactId = req.body.uid;
        const removeContact = await removeRequestContactSentService(currentUserId, contactId);//Hàm này ở phía service(truyền cho nó 2 tham số là id của người dùng hiện tại và id của người dùng muốn gửi lời mời kết bạn)
        return res.status(200).send({ success: !!removeContact });//(!!newContact kiểm tra xem bản ghi mới có được tạo hay không true or false)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    };
};
const readMoreContacts = async (req,res,next)=>{
    try {
        const skipNumberContact = +(req.query.skipNumber);
        const contacts = await readMoreContactsService(req.user._id,skipNumberContact);
        return res.status(200).send(contacts);
    } catch (error) {
        return res.status(500).send(error);
    };
};
const readMoreContactsSent = async (req,res,next)=>{
    try {
        const skipNumberContact = +(req.query.skipNumber);
        const contacts = await readMoreContactsSentService(req.user._id,skipNumberContact);
        return res.status(200).send(contacts);
    } catch (error) {
        return res.status(500).send(error);
    };
};
const readMoreContactsReceived = async (req,res,next)=>{
    try {
        const skipNumberContact = +(req.query.skipNumber);
        const contacts = await readMoreContactsReceivedService(req.user._id,skipNumberContact);
        return res.status(200).send(contacts);
    } catch (error) {
        return res.status(500).send(error);
    };
}
const removeRequestContactReceived = async(req,res,next)=>{
    try {
        const currentUserId = req.user._id;
        const contactId = req.body.uid;
        const removeContact = await removeRequestContactReceivedService(currentUserId, contactId);//Hàm này ở phía service(truyền cho nó 2 tham số là id của người dùng hiện tại và id của người dùng muốn gửi lời mời kết bạn)
        return res.status(200).send({ success: !!removeContact });//(!!newContact kiểm tra xem bản ghi mới có được tạo hay không true or false)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    };
}
const acceptRequestContactReceived = async (req,res,next)=>{
    try {
        const contactId = req.user._id;//user hiện tại đồng ý yêu cầu kết bạn
        const userId = req.body.uid;//user gửi lời mời kết bạn
        const removeContact = await acceptRequestContactReceivedService(contactId,userId);//Hàm này ở phía service(truyền cho nó 2 tham số là id của người dùng hiện tại và id của người dùng muốn gửi lời mời kết bạn)
        return res.status(200).send({ success: !!removeContact });//(!!newContact kiểm tra xem bản ghi mới có được tạo hay không true or false)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    };
};
const removeContact = async (req,res,next)=>{
    try {
        const currentUserId = req.user._id;
        const contactId = req.body.uid;
        const removeContact = await removeContactService(currentUserId,contactId);
        return res.status(200).send({ success: !!removeContact });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }; 
};
export  {
    findUsersContact, 
    addNew,
    removeRequestContactSent,
    readMoreContacts,
    readMoreContactsSent,
    readMoreContactsReceived,
    removeRequestContactReceived,
    acceptRequestContactReceived,
    removeContact
}
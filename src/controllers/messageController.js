import { validationResult } from 'express-validator/check';
import ejs from 'ejs';
import {
    addNewMessage as addNewMessageService,
    addNewMessageImage as addNewMessageImageService,
    addNewMessageAttachment as addNewMessageAttachmentService,
    addNewChatGroup as addNewChatGroupService,
    readMoreAllChat as readMoreAllChatService
} from './../services/messageService';
import DataUri from 'datauri';
import path from 'path';
import fsExtra from 'fs-extra';
import {lastItemOfArray,convertTimestampToHumanTime,bufferToBase64} from '../helpers/clientHelper';
import {promisify} from 'util';
const renderFile = promisify(ejs.renderFile).bind(ejs);
const dUri = new DataUri();
const addNewMessage = async (req, res) => {
    const errorArr = [];
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = Object.values(validationErrors.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg);
        });
        return res.status(500).send(errorArr[0]);
    }
    try {
        const sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        };
        const receiverId = req.body.uid;
        const messageVal = req.body.messageVal;
        const isChatGroup = req.body.isChatGroup;
        const message = await addNewMessageService(sender, receiverId, messageVal, isChatGroup);
        return res.status(200).send({ message });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};
const addNewMessageImage = async (req, res) => {
    try {
        const sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        };
        const receiverId = req.body.uid;
        const messageVal = dataUri(req).content;
        const isChatGroup = req.body.isChatGroup;
        const message = await addNewMessageImageService(sender, receiverId, messageVal, isChatGroup);
        return res.status(200).send({ message });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
const dataUri = (req) => {//Hàm chuyển đổi buffer sang kiểu image
    return dUri.format(path.extname(Date.now() + req.file.originalname).toString(), req.file.buffer);
};
const addNewMessageAttachment = async (req, res) => {
    try {
        const sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        };
        const receiverId = req.body.uid;
        const messageVal = req.file;
        const isChatGroup = req.body.isChatGroup;
        const message = await addNewMessageAttachmentService(sender, receiverId, messageVal, isChatGroup);
        await fsExtra.remove(`src/public/images/chat/message/${message.file.fileName}`)
        return res.status(200).send({ message });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};
const addNewChatGroup = async (req, res) => {
    const errorArr = [];
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = Object.values(validationErrors.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg);
        });
        return res.status(500).send(errorArr[0]);
    };
    try {
        const data = {
            name: req.body.groupChatName,
            userAmount: req.body.arrayIds.length,
            userId: req.user._id,
            members: req.body.arrayIds,
            createdAt: Date.now(),
        }
        const groupChat = await addNewChatGroupService(data);
        return res.status(200).send({ groupChat });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }

};
const readMoreAllChat = async (req,res)=>{
    try {
        const skipChatPersonal = +(req.query.skipChatPersonal);
        const skipChatGroup = +(req.query.skipChatGroup);
        const conversations = await readMoreAllChatService(req.user._id,skipChatPersonal,skipChatGroup);
        const dataToRender = {
            conversations,
            lastItemOfArray,
            convertTimestampToHumanTime,
            bufferToBase64,
            user:req.user
        };
        const leftSideData = await renderFile('src/views/main/readMoreConversations/_leftSide.ejs',dataToRender);
        const rightSideData = await renderFile('src/views/main/readMoreConversations/_rightSide.ejs',dataToRender);
        const imageModalData = await renderFile('src/views/main/readMoreConversations/_imageModal.ejs',dataToRender);
        const attachmentModalData = await renderFile('src/views/main/readMoreConversations/_attachmentModal.ejs',dataToRender);
       return res.status(200).send({
            leftSideData,
            rightSideData,
            imageModalData,
            
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    };
};
export {
    addNewMessage,
    addNewMessageImage,
    addNewMessageAttachment,
    addNewChatGroup,
    readMoreAllChat
}
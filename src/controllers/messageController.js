import { validationResult } from 'express-validator/check';
import {
    addNewMessage as addNewMessageService,
    addNewMessageImage as addNewMessageImageService,
    addNewMessageAttachment as addNewMessageAttachmentService,
    addNewChatGroup as addNewChatGroupService
} from './../services/messageService';
import DataUri from 'datauri';
import path from 'path';
import fsExtra from 'fs-extra';
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
export {
    addNewMessage,
    addNewMessageImage,
    addNewMessageAttachment,
    addNewChatGroup
}
import {validationResult} from 'express-validator/check';
import {addNewMessage as addNewMessageService,addNewMessageImage as addNewMessageImageService} from './../services/messageService';
import DataUri from 'datauri';
import path from 'path';
const dUri = new DataUri();
const addNewMessage = async (req,res)=>{
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
           id:req.user._id,
           name:req.user.username,
           avatar:req.user.avatar
        };
        const receiverId = req.body.uid;
        const messageVal = req.body.messageVal;
        const isChatGroup = req.body.isChatGroup;
        const message = await addNewMessageService(sender,receiverId,messageVal,isChatGroup);
        return res.status(200).send({message});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};
const addNewMessageImage = async (req,res)=>{
    try {
        const sender = {
           id:req.user._id,
           name:req.user.username,
           avatar:req.user.avatar
        };
        const receiverId = req.body.uid;
        const messageVal = dataUri(req).content;
        const isChatGroup = req.body.isChatGroup;
        const message = await addNewMessageImageService(sender,receiverId,messageVal,isChatGroup);
        return res.status(200).send({message});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
const dataUri = (req)=>{//Hàm chuyển đổi buffer sang kiểu image
    return  dUri.format(path.extname(Date.now()+req.file.originalname).toString(),req.file.buffer);
  };
export {
    addNewMessage,
    addNewMessageImage
}
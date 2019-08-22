import {validationResult} from 'express-validator/check';
import {addNewMessage as addNewMessageService} from './../services/messageService';
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
}
export {
    addNewMessage
}
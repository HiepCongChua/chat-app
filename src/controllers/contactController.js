import { validationResult } from "express-validator/check";
import { findUserContact as findUsersContactService , addNew as addNewService } from "../services/contactService";
const findUsersContact = async (req,res,next)=>{
//   const errorArr=[];
//   const validationErrors = validationResult(req);
//   if(!validationErrors.isEmpty())
//   {
//       const errors = Object.values(validationErrors.mapped());
//       errors.forEach(item=>{
//           errorArr.push(item.msg);
//       });
//    return res.status(500).send(errorArr);   
//   };
  try {
      const currentUserId = req.user._id;//Lấy id của user hiện tại 
      const keyword = req.params.keyword;
      const users = await findUsersContactService(currentUserId,keyword);//Tìm contact nhưng loại trì user đang search
      return res.render('main/contact/sections/_findUsersContact',{users});
  } catch (error) {
      console.log(error.message);
      return res.status(500).send(error);
  }  
};
const addNew = async (req,res,next)=>{//Đây là hàm có nhiệm vụ add contact (tức là đứng từ người dùng A gửi lời mời kết bạn đến người dùng B)
    try {
        const currentUserId = req.user._id;
        const contactId = req.body.uid;
        const newContact = await addNewService(currentUserId,contactId);//Hàm này ở phía service(truyền cho nó 2 tham số là id của người dùng hiện tại và id của người dùng muốn gửi lời mời kết bạn)
         return res.status(200).send({success:!!newContact});//(!!newContact kiểm tra xem bản ghi mới có được tạo hay không true or false)
    } catch (error) {
        return res.status(500).send(error);
    };
};
export default {
    findUsersContact,
    addNew
}
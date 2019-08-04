import ContactModel from '../models/contactModel';
import UserModel from '../models/userModel';
import _ from  'lodash';
const findUserContact = (currentUserId,keyword)=>{//Hàm này giao tiếp của model để lấy kết quả của tìm kiếm , kết quả trả về không bao gồm (người dùng hiện tại) và những người đã trong danh sách liên lạc 
 return new Promise(async(resolve,reject)=>{
     let deprecateUserIds = [currentUserId];//Loại trừ những _id trong mảng này.
     const contactsByUser = await ContactModel.findAllByUser(currentUserId);
     contactsByUser.forEach(contact => {
         deprecateUserIds.push(contact.userId);
         deprecateUserIds.push(contact.contactId);
     });
     deprecateUserIds = _.uniqBy(deprecateUserIds);//loại bỏ những key trùng lặp
     const users = await UserModel.findAllForAddContact(deprecateUserIds,keyword);
     resolve(users);
 });
};
const addNew = (currentUserId,contactId)=>{
  return new Promise(async(resolve,reject)=>{
     const contactExists = await ContactModel.checkExists(currentUserId,contactId);
     if(contactExists)
     {
       return reject(false);
     }
     const newContactItem = {
       userId : currentUserId,
       contactId
     };
     const newContact = await ContactModel.createNew(newContactItem);
     resolve(newContact);
  });
 };
export  {
  findUserContact,
  addNew
};

import ContactModel from '../models/contactModel';
import UserModel from '../models/userModel';
import _ from  'lodash';
const findUserContact = (currentUserId,keyword)=>{
 return new Promise(async(resolve,reject)=>{
     let deprecateUserIds = [currentUserId];//Loại trừ những _id trong mảng này.
     const contactsByUser = await ContactModel.findAllByUser(currentUserId);//Tìm tất cả những liên lạc 
     contactsByUser.forEach(contact => {
         deprecateUserIds.push(contact.userId);
         deprecateUserIds.push(contact.contactId);
     });
     deprecateUserIds = _.uniqBy(deprecateUserIds);
     const users = await UserModel.findAllForAddContact(deprecateUserIds,keyword);
     console.log(users);
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

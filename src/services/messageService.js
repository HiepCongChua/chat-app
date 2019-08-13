import ContactModel from './../models/contactModel';
import UserModel from './../models/userModel';
import ChatGroupModel from './../models/chatGroupModel'
const LIMIT_CONVERSATIONS_TAKEN = 15;
const getAllConversationItems = (currentUserId)=>{
  return new Promise(async(resolve,reject)=>{
      try {
        const skip = 0
        const contacts = await ContactModel.getContacts(id, skip, LIMIT_RECORD);
        const userConversations = await Promise.all(contacts.map(async (contact) => {
          return await UserModel.findListContacts(contact.userId, contact.contactId, id);
        })); 
    
      } catch (error) {
          reject(error);
      }
  })
}
export {
    getAllConversationItems
}
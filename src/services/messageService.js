import ContactModel from './../models/contactModel';
import UserModel from './../models/userModel';
import ChatGroupModel from './../models/chatGroupModel';
import _ from 'lodash';
const LIMIT_CONVERSATIONS_TAKEN = 15;
const getAllConversationItems = (currentUserId)=>{
  return new Promise(async(resolve,reject)=>{
      try {
        const skip = 0
        const contacts = await ContactModel.getContacts(currentUserId, skip, LIMIT_CONVERSATIONS_TAKEN);
        let userConversations = await Promise.all(contacts.map(async (contact) => {
          const getUserContact = await UserModel.findListContacts(contact.userId, contact.contactId,currentUserId);
          getUserContact[0].createdAt = contact.createdAt;
          return getUserContact[0];
        })); 
        const groupConversations = await ChatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
        const allConversations = userConversations.concat(groupConversations).sort((itemPre,itemNext)=>{
          return itemNext.createdAt - itemPre.createdAt
        });
        resolve({
          userConversations,
          groupConversations,
          allConversations
        });
      } catch (error) {
          reject(error);
      }
  })
}
export {
    getAllConversationItems
}


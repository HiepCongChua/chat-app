import ContactModel from './../models/contactModel';
import UserModel from './../models/userModel';
import ChatGroupModel from './../models/chatGroupModel';
import {model as MessageModel,MESSAGE_CONVERSATION_TYPES,MESSAGE_TYPES} from './../models/messageModel';
import _ from 'lodash';
const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;
const getAllConversationItems = (currentUserId)=>{
  return new Promise(async(resolve,reject)=>{
      try {
        const skip = 0
        const contacts = await ContactModel.getContacts(currentUserId, skip, LIMIT_CONVERSATIONS_TAKEN);
        let userConversations = await Promise.all(contacts.map(async (contact) => {
          const getUserContact = await UserModel.findListContacts(contact.userId, contact.contactId,currentUserId);
          getUserContact[0].updatedAt = contact.updatedAt;
          return getUserContact[0];
        })); 
        const groupConversations = await ChatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
        const allConversations = userConversations.concat(groupConversations).sort((itemPre,itemNext)=>{
          return itemNext.updatedAt - itemPre.updatedAt
        });
        let allConversationWithMessage = await Promise.all(allConversations.map(async(conversation)=>{
          const getMessages = await MessageModel.getMessages(currentUserId,conversation._id,LIMIT_MESSAGES_TAKEN);
          conversation = conversation.toObject();
          conversation.messages = getMessages;
          return conversation;
        }))
        allConversationWithMessage = allConversationWithMessage.sort((itemPre,itemNext)=>{
          return itemNext.updatedAt - itemPre.updatedAt;
        })
        // console.log(allConversationWithMessage);
        ;

        resolve({
          userConversations,
          groupConversations,
          allConversations,
          allConversationWithMessage
        });
      } catch (error) {
          reject(error);
      }
  })
}
export {
    getAllConversationItems
}


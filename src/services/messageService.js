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
        // userConversations = [...userConversations].map((user)=>{
        //   return user[0];
        // });
        const groupConversations = await ChatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
        const allConversations = userConversations.concat(groupConversations).sort((itemPre,itemNext)=>{
          return itemNext.createdAt - itemPre.createdAt
        });
        console.log(allConversations);
        resolve(true);
      } catch (error) {
          reject(error);
      }
  })
}
export {
    getAllConversationItems
}

// [ { _id: 5d542641086b920beee36225,
//   name: 'Học Node.js',
//   userAmount: 17,
//   userIs: '5d4822de5db2ec25e46d1d8a',
//   createAt: 1565796065599,
//   deletedAt: null,
//   updatedAt: null,
//   createdAt: 1565800651490,
//   members: [ [Object], [Object], [Object], [Object] ],
//   messageAmount: 0 } ] 
  
//   [ 
//     [ { _id: 5d48230a5db2ec25e46d1d8b,
//     username: 'toilacoder',
//     avatar: null,
//     address: null },
//   createdAt: 1565798832380 ],

// [ { _id: 5d4c51867f280d05e82504af,
//     username: 'Hiệp Lê Minh',
//     avatar: null,
//     address: null },
//   createdAt: 1565798792672 ],

// [ { _id: 5d483dcb842bfe061c88b935,
//     username: 'Lê Minh Hiệp',
//     avatar: null,
//     address: null },
//   createdAt: 1565798479880 ] 

// ]
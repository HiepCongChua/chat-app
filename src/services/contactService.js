import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import _ from "lodash";
import { model as Notification, types } from './../models/notificationModel';
const LIMIT_RECORD = 1;
const findUserContact = (currentUserId, keyword) => {
  //Hàm này giao tiếp của model để lấy kết quả của tìm kiếm , kết quả trả về không bao gồm (người dùng hiện tại) và những người đã trong danh sách liên lạc
  return new Promise(async (resolve, reject) => {
    let deprecateUserIds = [currentUserId]; //Loại trừ những _id trong mảng này.
    const contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.forEach(contact => {
      deprecateUserIds.push(contact.userId);
      deprecateUserIds.push(contact.contactId);
    });
    deprecateUserIds = _.uniqBy(deprecateUserIds); //loại bỏ những key trùng lặp
    const users = await UserModel.findAllForAddContact(
      deprecateUserIds,
      keyword
    );
    resolve(users);
  });
};
const addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    const contactExists = await ContactModel.checkExists(
      currentUserId,
      contactId
    );
    if (contactExists) {
      return reject(false);
    };
    //create contact
    const newContactItem = {
      userId: currentUserId,
      contactId
    };
    const newContact = await ContactModel.createNew(newContactItem);
    //create notification
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: types.ADD_CONTACT
    };
    await Notification.createNew(notificationItem);
    resolve(newContact);
  });
};
const removeRequestContactSent = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await ContactModel.removeRequestContactSent(
        currentUserId,
        contactId
      );
      //remove notification
      await Notification.removeRequestContactNotification(currentUserId, contactId, types.ADD_CONTACT);
      return resolve(true);
    } catch (error) {
      console.log(error)
      return reject(false)
    };
  });
};
const getContacts = (id) => {//Lấy những user trong danh sách bạn bè
  return new Promise(async (resolve, reject) => {
    try {
      const skip = 0
      const contacts = await ContactModel.getContacts(id, skip, LIMIT_RECORD);
      const users = await Promise.all(contacts.map(async (contact) => {
        return await UserModel.findListContacts(contact.userId, contact.contactId, id);
      }));
      return resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
const getContactsSent = (id) => {
  //Lấy những user mình đã gửi lời mời kết bạn
  //trong bảng Contact thì userId là người gửi lời mời kết bạn còn contactId là người nhận
  return new Promise(async (resolve, reject) => {
    try {
      const skip = 0;
      const contacts = await ContactModel.getContactsSent(id, skip, LIMIT_RECORD);
      const users = await Promise.all(contacts.map(async (contact) => {
        return await UserModel.findUserById(contact.contactId);
      }));
      return resolve(users);
    } catch (error) {
      reject(error);
    };
  });
};
const getContactReceive = (id) => {
  return new Promise(async (resolve, reject) => {
    //Lấy những user mình đã gửi lời mời kết bạn 
    //trong bảng Contact thì userId là người gửi lời mời kết bạn còn contactId là người nhận
    try {
      const skip = 0;
      const contacts = await ContactModel.getContactsReceive(id, skip, LIMIT_RECORD);
      const users = await Promise.all(contacts.map(async (contact) => {
        return await UserModel.findUserById(contact.userId);
      }));
      return resolve(users);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const countAllcontacts = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await ContactModel.countAllContacts(id);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  })
};
const countAllcontactsReceive = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await ContactModel.countAllContactsReceive(id);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};
const countAllcontactsSent = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await ContactModel.countAllContactsSent(id);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};
const readMoreContacts = (id, skip) => {
  return new Promise(async (resolve, reject) => {
    try {
      skip = (!!parseInt(skip)) ? parseInt(skip) : 0;
      const contacts = await ContactModel.getContacts(id, skip, LIMIT_RECORD);
      const users = await Promise.all(contacts.map(async (contact) => {
        return await UserModel.findListContacts(contact.userId, contact.contactId, id);
      }));
      return resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
const readMoreContactsSent = (id, skip) => {
  return new Promise(async (resolve, reject) => {
    try {
      skip = (!!parseInt(skip)) ? parseInt(skip) : 0;
      const contacts = await ContactModel.getContactsSent(id, skip, LIMIT_RECORD);
      const users = await Promise.all(contacts.map(async (contact) => {
        return await UserModel.findListContacts(contact.userId, contact.contactId, id);
      }));
      return resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
const readMoreContactsReceived = (id, skip) => {
  return new Promise(async (resolve, reject) => {
    try {
      skip = (!!parseInt(skip)) ? parseInt(skip) : 0;
      const contacts = await ContactModel.getContactsReceive(id, skip, LIMIT_RECORD);
      const users = await Promise.all(contacts.map(async (contact) => {
        return await UserModel.findListContacts(contact.userId, contact.contactId, id);
      }));
      return resolve(users);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const removeRequestContactReceived = ()=>{
  return new Promise(async (resolve, reject) => {
    try {
      await ContactModel.removeRequestContactReceived(
        currentUserId,
        contactId
      );
      //remove notification
      // await Notification.removeRequestContactReceivedNotification(currentUserId, contactId, types.ADD_CONTACT);
      return resolve(true);
    } catch (error) {
      console.log(error)
      return reject(false)
    };
  });
}
export {
  findUserContact,
  addNew,
  removeRequestContactSent,
  getContacts,
  getContactsSent,
  getContactReceive,
  countAllcontacts,
  countAllcontactsSent,
  countAllcontactsReceive,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived,
  removeRequestContactReceived
};

 import express from "express";
import { getLoginRegister,postRegister,verifyAccount,getLogout,checkLoggedIn,checkLoggedOut} from "./../controllers/authController";
import {getHome} from "./../controllers/homeController";
import {
  findUsersContact,
  addNew,removeRequestContactSent,
  readMoreContacts,readMoreContactsSent,
  readMoreContactsReceived,
  removeRequestContactReceived,
  acceptRequestContactReceived,
  removeContact
} from './../controllers/contactController';
import {updateAvatar,updateInfo,updatePasswordUser} from './../controllers/userController';
import {registerValidation} from "./../validation/authValidation";
import {udpateInfoValidation,updatePasswordValidation} from './../validation/userValidation';
import {findUsersContact as findUsersContactValid} from './../validation/contactValidation';
import {checkMessageValidation} from './../validation/messageValidation';
import {readMore,markAllAsRead} from './../controllers/notificationController';
import passport from "passport";
import { initPassportLocal } from "./../controllers/passportController/local";
import { initPassportFacebook } from "./../controllers/passportController/facebook";
import { initPassportGoogle } from "./../controllers/passportController/google";
import {initPassportGitHub} from './../controllers/passportController/github';
import {addNewMessage,addNewMessageImage,addNewMessageAttachment} from './../controllers/messageController';
import {multer_upload_image} from '../helpers/configMulterUploadImage';
import {multer_upload_attachment} from '../helpers/configMulterUploadAttachment';
initPassportLocal();
initPassportFacebook();
initPassportGoogle();
initPassportGitHub();
const router = express.Router();
const initRouters = app => {
  router.get("/",checkLoggedIn, getHome);
  router.get("/login-register",checkLoggedOut,getLoginRegister);
  router.post("/register",checkLoggedOut,registerValidation,postRegister);
  router.get("/verify/:token", checkLoggedOut, verifyAccount);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login-register", 
      successFlash: true,
      failureFlash: true
    })
  );
  router.get("/logout", checkLoggedIn, getLogout);
  router.get(
    "/auth/facebook",
    checkLoggedOut,
    passport.authenticate("facebook", { scope: ["email"] })
  );
  router.get(
    "/auth/github",
    checkLoggedOut,
    passport.authenticate("github",{ scope: ["email"] })
  );
  router.get(
    "/auth/github/callback",
    checkLoggedOut,
    passport.authenticate("github", {
      successRedirect: "/",
      failureRedirect: "/login-register"
    })
  );
  router.get(
    "/auth/facebook/callback",
    checkLoggedOut,
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login-register"
    })
  );
  router.get(
    "/auth/google",
    checkLoggedOut,
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  router.get(
    "/auth/google/callback",
    checkLoggedOut,
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login-register"
    })
  );
  router.put("/user/update-avatar", checkLoggedIn,updateAvatar);
  router.put("/user/update-info",udpateInfoValidation, checkLoggedIn,updateInfo);
  router.put("/user/update-password", checkLoggedIn,updatePasswordValidation,updatePasswordUser);
  router.get('/contact/find-users/:keyword', checkLoggedIn,findUsersContactValid,  findUsersContact);
  router.post('/contact/add-new', checkLoggedIn,  addNew); //Router gửi một yêu cầu kết bạn
  router.delete('/contact/remove-request-contact-sent', checkLoggedIn, removeRequestContactSent);//Router hủy yêu cầu kết bạn (A=>B nhưng B chưa đồng ý thì A hủy lời mời);
  router.delete('/contact/remove-request-contact-received',checkLoggedIn,removeRequestContactReceived)
  router.get('/notification/read-more', checkLoggedIn,readMore);
  router.put('/notification/mark-all-as-read',checkLoggedIn,markAllAsRead);
  router.get('/contact/read-more-contacts',checkLoggedIn,readMoreContacts);
  router.get('/contact/read-more-contacts-sent',checkLoggedIn,readMoreContactsSent);
  router.get('/contact/read-more-contacts-received',checkLoggedIn,readMoreContactsReceived);
  router.put('/contact/accept-request-contact-received',checkLoggedIn,acceptRequestContactReceived);
  router.delete('/contact/user-remove-contact',checkLoggedIn,removeContact);
  router.post('/message/add-new-text-emoji',checkLoggedIn,checkMessageValidation,addNewMessage);
  router.post('/message/add-message-image',checkLoggedIn,multer_upload_image('my-image-chat'),addNewMessageImage);
  router.post('/message/add-message-attachment',checkLoggedIn,
  multer_upload_attachment('my-attachment-chat'),
  addNewMessageAttachment)
  return app.use("/", router);
};
export default initRouters;


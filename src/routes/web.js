 import express from "express";
import { getLoginRegister,postRegister,verifyAccount,getLogout,checkLoggedIn,checkLoggedOut} from "./../controllers/authController";
import {getHome} from "./../controllers/homeController";
import {findUsersContact,addNew,removeNew,readMoreContacts,readMoreContactsSent,readMoreContactsReceived} from './../controllers/contactController';
import {updateAvatar,updateInfo,updatePasswordUser} from './../controllers/userController';
import {registerValidation} from "./../validation/authValidation";
import {udpateInfoValidation,updatePasswordValidation} from './../validation/userValidation';
import {findUsersContact as findUsersContactValid} from './../validation/contactValidation';
import {readMore,markAllAsRead} from './../controllers/notificationController';
import passport from "passport";
import { initPassportLocal } from "./../controllers/passportController/local";
import { initPassportFacebook } from "./../controllers/passportController/facebook";
import { initPassportGoogle } from "./../controllers/passportController/google";
initPassportLocal();
initPassportFacebook();
initPassportGoogle();
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
  router.delete('/contact/remove-request-contact', checkLoggedIn,  removeNew);//Router hủy yêu cầu kết bạn (A=>B nhưng B chưa đồng ý thì A hủy lời mời);
  router.get('/notification/read-more', checkLoggedIn,readMore);
  router.put('/notification/mark-all-as-read',checkLoggedIn,markAllAsRead);
  router.get('/contact/read-more-contacts',checkLoggedIn,readMoreContacts);
  router.get('/contact/read-more-contacts-sent',checkLoggedIn,readMoreContactsSent);
  router.get('/contact/read-more-contacts-received',checkLoggedIn,readMoreContactsReceived)
  return app.use("/", router);
};
export default initRouters;


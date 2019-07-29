import express from "express";
import auth from "./../controllers/authController";
import home from "./../controllers/homeController";
import { register } from "./../validation/authValidation";
import passport from "passport";
import { initPassportLocal } from "./../controllers/passportController/local";
import { initPassportFacebook } from "./../controllers/passportController/facebook";
import { initPassportGoogle } from "./../controllers/passportController/google";
initPassportLocal();
initPassportFacebook();
initPassportGoogle();
const router = express.Router();
const initRouters = app => {
  router.get("/", auth.checkLoggedIn, home.getHome);
  router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister);
  router.post("/register", auth.checkLoggedOut, register, auth.postRegister);
  router.get("/verify/:token", auth.checkLoggedOut, auth.verifyAccount);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login-register", 
      successFlash: true,
      failureFlash: true
    })
  );
  router.get("/logout", auth.checkLoggedIn, auth.getLogout);
  router.get(
    "/auth/facebook",
    auth.checkLoggedOut,
    passport.authenticate("facebook", { scope: ["email"] })
  );
  router.get(
    "/auth/facebook/callback",
    auth.checkLoggedOut,
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login-register"
    })
  );
  router.get(
    "/auth/google",
    auth.checkLoggedOut,
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  router.get(
    "/auth/google/callback",
    auth.checkLoggedOut,
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login-register"
    })
  );
  return app.use("/", router);
};
export default initRouters;

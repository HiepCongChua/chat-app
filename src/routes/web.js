import express from 'express';
import auth from './../controllers/authController';
import home from './../controllers/homeController';
import {register} from './../validation/authValidation';
import passport from 'passport';
import {initPassportLocal} from './../controllers/passportController/local'
initPassportLocal();
const router = express.Router();
const initRouters = (app)=>{
    router.get('/',auth.checkLoggedIn ,home.getHome);
    router.get('/login-register',auth.checkLoggedOut,auth.getLoginRegister);
    router.post('/register',auth.checkLoggedOut,register,auth.postRegister);
    router.get('/verify/:token',auth.checkLoggedOut,auth.verifyAccount);
    router.post('/login',passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login-register',
        successFlash:true,
        failureFlash:true
    }));
    router.get('/logout',auth.checkLoggedIn,auth.getLogout)
    return app.use("/",router);
};
export default initRouters;
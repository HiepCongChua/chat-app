import express from 'express';
import auth from './../controllers/authController';
import home from './../controllers/homeController';
import {register} from './../validation/authValidation';
const router = express.Router();
const initRouters = (app)=>{
    router.get('/',home.getHome);
    router.get('/login-register',auth.getLoginRegister);
    router.post('/register',register,auth.postRegister);
    return app.use("/",router);
};
export default initRouters;
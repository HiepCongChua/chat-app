import express from 'express';
import auth from './../controllers/authController';
import home from './../controllers/homeContrller';
const router = express.Router();

const initRouters = (app)=>{
    router.get('/',home.getHome);
    router.get('/login-register',auth.getLoginRegister);
    return app.use("/",router);
};
export default initRouters;
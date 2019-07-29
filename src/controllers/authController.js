import { validationResult } from "express-validator/check";
import { register , verifyAccount as verifyAccountService } from "../services/authService";
import {transSuccess} from './../../lang/vi';
const getLoginRegister = (req, res, next) => {
  return res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};
const postRegister = async (req, res, next) => {
   const errorArr = [];
    const successArr = [];
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = Object.values(validationErrors.mapped());
      errors.forEach(item => {
        errorArr.push(item.msg);
      });
      req.flash("errors", errorArr);
      return res.redirect("/login-register");
    }
  try {
    //Sau khi kiểm tra thông tin user gửi lên hợp lệ thì gửi data cho phía service xử lý
    //service sẽ kết nối với db để tạo record
    const createdUserSuccess = await register(req.body,req.protocol,req.get('host'));//ham register trả về một promise value là một string
    successArr.push(createdUserSuccess);//trong trường hợp promise resolve 
    req.flash('success',successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);//trong trường hợp register trả về reject
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};
const verifyAccount = async (req,res,next)=>{
  const errorArr = [];
  const successArr = [];
  try {
    //gửi data cho service xử lý
    //service sẽ trả về một promise nếu resolove sẽ thực thi tiếp nếu reject sẽ nhảy vào catch
    const verifySuccess = await verifyAccountService(req.params.token);
    console.log(verifySuccess);
    successArr.push(verifySuccess);
    req.flash('success',successArr);
    return res.redirect('/login-register')
  } catch (error) {
    console.log(error);
    errorArr.push(error);//trong trường hợp register trả về reject
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};
const getLogout = (req,res,next)=>{
req.logout(); //remove session passport , only using passport
req.flash('success',transSuccess.ACCOUNT_LOGOUT);
return res.redirect('/login-register');
};
const checkLoggedIn = (req,res,next)=>{
  if(!req.isAuthenticated())//Check user login , only using passport
  {
    return res.redirect('/login-register');
  };
  next();
};
const checkLoggedOut = (req,res,next)=>{
  if(req.isAuthenticated())//Check user login , only using passport
  {
    return res.redirect('/');
  };
  next();
};
export default {
  getLoginRegister,
  postRegister,
  verifyAccount,
  getLogout,
  checkLoggedIn,
  checkLoggedOut
};

import { validationResult } from "express-validator/check";
import { register } from "../services/authService";
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
    //Trong trường hợp đăng kí thành công hàm register ở authService trả về một Promise.resolve chưa String
    //Tiếp theo đẩy nó vào mảng sucessArr.
    const createdUserSuccess = await register(req.body);
    successArr.push(createdUserSuccess);
    req.flash('success',successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};
export default {
  getLoginRegister,
  postRegister
};

import UserModel from "../models/userModel";
import uuidv4 from "uuid/v4";
import bcrypt from "bcryptjs";
import {sendMail} from '../config/sendGrid'
import { transErrorsMessage , transSuccess ,transMail } from "../../lang/vi";
const register = ({ gender, email, password },protocol,host) => {
  return new Promise(async (resolve, reject) => {
    const userByEmail = await UserModel.findByEmail(email);
    if (userByEmail) {//Trong trường hợp phát sinh lỗi sẽ trả về một Promise reject chứa string để thông báo lỗi
      if (userByEmail.deletedAt != null) {
        return reject(transErrorsMessage.ACCOUNT_REMOVED);//Trong trường hợp đăng kí email của tài khoản đã bị vô hiện
      }
      if (!userByEmail.local.isActive) {
        return reject(transErrorsMessage.ACCOUNT_NOT_ACTIVE);//Trong trường hợp đăng kí email của tài khoản chưa kích hoạt
      }
      return reject(transErrorsMessage.ACCOUNT_IN_USER);//Trong trường hợp đăng kí trùng email
    }
    const salt = bcrypt.genSaltSync(8);
    const userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4()
      }
    };
    const user = await UserModel.createNew(userItem);
    const linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`
    // Send mail to active account
    sendMail(email,transMail.SUBJECT,transMail.template(linkVerify))
    .then(success=>{
      resolve(transSuccess.userCreated(user.local.email));//Trong trường hợp thành công sẽ trả về một string bao gồm mail của người tạo tài khoản
    })
    .catch(async(err)=>{
      console.log(err);
      await UserModel.removeById(user._id);
      reject(transMail.SEND_FAILED);
    })
    ;

  });
};
const verifyAccount = (token)=>{
  return new Promise(async(res,rej)=>{
    const userByToken = await UserModel.findByTokenAndActiveTime(token);
    if(!userByToken)
    {
      return rej(transErrorsMessage.LINK_ERROR);
    }
    await UserModel.verify(token);
    res(transSuccess.ACCOUNT_ACTIVE);
  })
};
export { register , verifyAccount };

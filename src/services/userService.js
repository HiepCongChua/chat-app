import UserModel from './../models/userModel';
import { transErrorsMessage } from "../../lang/vi";
import bcrypt from 'bcryptjs';
const updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
}
const updatePassword = async (id,{currentPass,newPass}) => {
  //Sử dụng new Promise thay cho async , await 
  //=>giúp có thể trả về một Promise dạng resolve hoặc reject bất cứ lúc nào để cho tầng controller xử lý
  //=> khi sử dụng try catch thì chúng ta phải xử lý luôn ở tầng service.
  return new Promise(async(res, rej) => {
    const currentUser = await UserModel.findUserByIdForChangePassword(id);
    if (!currentUser) {
      return rej(transErrorsMessage.ACCOUNT_UNDEFINED);
    };
    let flag = await currentUser.comparePassword(currentPass);
    if (!flag) {
      return rej(transErrorsMessage.PASSWORD_INCORRECT);
    };
    const salt = bcrypt.genSaltSync(8);
    await UserModel.updatePassword(id,bcrypt.hashSync(newPass,salt));
    res(true)
  });
};
export {
  updateUser,
  updatePassword
}



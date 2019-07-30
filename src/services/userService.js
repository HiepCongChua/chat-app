import UserModel from './../models/userModel';
const updateUser = (id,item)=>{
  return UserModel.updateUser(id,item);
}
export {
    updateUser
}



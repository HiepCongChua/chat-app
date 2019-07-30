import multer from "multer";
import { multerConfigCondition } from "./../config/app";
import { transErrorsMessage, transSuccess } from "../../lang/vi";
import uuidv4 from "uuid/v4";
import { updateUser } from "./../services/userService";
import fsExtra from 'fs-extra';
const storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, multerConfigCondition.avatar_directory);
  },
  filename: (req, file, callback) => {
    const math = multerConfigCondition.avatar_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transErrorsMessage.AVATAR_TYPE, null);
    }
    const avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarName);
  }
});
const avatarUploadFile = multer({
  storage: storageAvatar,
  limits: { fileSize: multerConfigCondition.avatar_limit_size }
}).single("avatar"); //tìm trong thông tin mà Ajax gửi lên có field name là avatar
const updateAvatar =  (req,res) => {
  avatarUploadFile(req,res,async(err) => {
    console.log(err);
    if (err) {
      if (err.message == "File too large") {
        return res
          .status(500)
          .send(transErrorsMessage.AVATAR_LIMIT_SIZE_MESSAGE);
      }
      return res.status(500).send(err.message);
    }
    try {
      const updateUserItem = {
        avatar: req.file.filename,
        updatedAt: Date.now()
      };
      const res_ = await updateUser(req.user._id, updateUserItem);//Sau khi cập nhật xong thì mongooose sẽ vẫn trả về doc cũ chưa được cập nhật
      //Sau khi update avatar phải xóa avarta cũ  
      await fsExtra.remove(`${multerConfigCondition.avatar_directory}/${res_.avatar}`);//Vì vậy res.avarta vẫn là địa chỉ avatar cũ;
      const result = {
          message:transSuccess.AVATAR_UPDATED,
          imageSrc:`/images/users/${req.file.filename}`
      };
      console.log(result);
      return res.status(200).send(result)
    } catch (error) {
        console.log(error);
       return res.status(500).send(error);
    }
  });
};
export { updateAvatar };

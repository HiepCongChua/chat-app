import passport from "passport";
import PassportFacebook from "passport-facebook";
import UserModel from "./../../models/userModel";
import ChatGroupModel from './../../models/chatGroupModel';
import { transErrorsMessage, transSuccess } from "../../../lang/vi";
const FacebookStrategy = PassportFacebook.Strategy; //Khai báo chiến lược xác thực
const initPassportFacebook = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.CLIENT_ID_FB,
        clientSecret: process.env.CLIENT_SECRET_FB,
        callbackURL: process.env.CALLBACK_URL_FB,
        profileFields: ["email", "gender", "displayName"],
        passReqToCallback: true //Sau khi xác thực xong thì truyền kết quả vào trong callback bên dưới
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const user = await UserModel.findUserByFacebookUid(profile.id);
          if (user) {
            return done(
              null,
              user,
              req.flash("success", transSuccess.loginSuccess(user.username))
            );
          }
          const newUser = await UserModel.create({
            username: profile.displayName,
            gender: profile.gender,
            local: {
              isActive: true
            },
            facebook: {
              uid: profile.id,
              token: accessToken,
              email: profile.emails[0].value
            }
          });
          return done(
            null,
            newUser,
            req.flash("success", transSuccess.loginSuccess(newUser.username))
          );
        } catch (error) {
          console.log(error);
          return done(
            null,
            false,
            req.flash("errors", transErrorsMessage.SERVER_ERROR)
          );
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    //hàm này sẽ ghi thông tin của người dùng vào trong session (thường là ghi id của user)
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    //Khi request chạy vào middleware passport.session() sẽ lấy thông tin người dùng (id trong session vừa config ở serializeUser) để truyền vào trong callback
    //hàm này sử dụng thông tin để tìm kiếm user => gán user cho req
    try {
      const user = await UserModel.findUserById(id);
      if (user) {
        const chatGroupIds = await ChatGroupModel.getChatGroupIdsUser(user._id);
        user.chatGroupIds = chatGroupIds;
        console.log("This is facebook");
        return done(null, user);
      }
    } catch (error) {
      console.log(error);
      return done(error, null);
    }
  });
};

export { initPassportFacebook };

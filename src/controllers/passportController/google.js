import passport from "passport";
import PassportGoogle from "passport-google-oauth";
import UserModel from "./../../models/userModel";
import ChatGroupModel from './../../models/chatGroupModel';
import { transErrorsMessage, transSuccess } from "../../../lang/vi";
const GoogleStrategy = PassportGoogle.OAuth2Strategy; //Khai báo chiến lược xác thực
const initPassportGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID_GOOGLE,
        clientSecret: process.env.CLIENT_SECRET_GOOGLE,
        callbackURL: process.env.CALLBACK_URL_GOOGLE,
        passReqToCallback: true //Sau khi xác thực xong thì truyền kết quả vào trong callback bên dưới
      },
      async (req, accessToken,refreshToken,profile,done) => {
        try {
          const user = await UserModel.findUserByGoogleUid(profile.id);
          if (user) {
            return done(
              null,
              user,
              req.flash("success", transSuccess.loginSuccess(user.username))
            );
          };
          const newUser = await UserModel.create({
            username: profile.displayName,
            gender: profile.gender,
            local: {
              isActive: true
            },
            google: {
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
      let user = await UserModel.findUserById(id);
      if (user) {
        const chatGroupIds = await ChatGroupModel.getChatGroupIdsUser(user._id);
        user.chatGroupIds = chatGroupIds;
        return done(null, user);
      }
    } catch (error) {
      console.log(error);
      return done(error, null);
    }
  });
};

export { initPassportGoogle };

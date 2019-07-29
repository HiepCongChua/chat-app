import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "./../../models/userModel";
import { transErrorsMessage, transSuccess } from "../../../lang/vi";
const LocalStrategy = passportLocal.Strategy; //Khai báo chiến lược xác thực
const initPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",//khai báo 2 trường để cho passport dựa vào để xác thực
        passwordField: "password",//
        passReqToCallback: true //Sau khi xác thực xong thì truyền kết quả vào trong callback bên dưới
      },
      async (req, email, password, done) => {
        try {
          const user = await UserModel.findByEmail(email);
          if (!user) {
            return done(
              null,
              false,
              req.flash("errors", transErrorsMessage.LOGIN_FAILED)
            );
          }
          if (!user.local.isActive) {
            return done(
              null,
              false,
              req.flash("errors", transErrorsMessage.ACCOUNT_NOT_ACTIVE)
            );
          }
          const checkPassword = await user.comparePassword(password);
          if (!checkPassword) {
            return done(
              null,
              false,
              req.flash("errors", transErrorsMessage.LOGIN_FAILED)
            );
          }
          return done(
            null,
            user,
            req.flash("success", transSuccess.loginSuccess(user.username))
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
    //Khi chạy vào passport.session() sẽ lấy thông tin người dùng (id trong session vừa config ở serializeUser) để truyền vào trong callback
    try {
      const user = await UserModel.findUserById(id);
      if (user) {
        return done(null, user);
      }
    } catch (error) {
      console.log(error);
      return done(error, null);
    }
  });
};

export { initPassportLocal };

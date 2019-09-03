import passport from "passport";
import PassportGitHub from "passport-github";
import UserModel from "./../../models/userModel";
import ChatGroupModel from './../../models/chatGroupModel';
import { transErrorsMessage, transSuccess } from "../../../lang/vi";
const GitHubStrategy = PassportGitHub.Strategy; //Khai báo chiến lược xác thực
const initPassportGitHub = () => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_API_CLIENT_ID,
        clientSecret: process.env.GITHUB_API_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL_GITHUB,
        passReqToCallback: true
      },
      async (req,accessToken, refreshToken, profile, cb) => {
        try {
          const user = await UserModel.findUserByGitHubUid(profile.id);
          if (user) {
            return cb(
              null,
              user,
              req.flash("success", transSuccess.loginSuccess(user.username))
            );
          }
          const newUser = await UserModel.create({
            username: profile.displayName,
            local: {
              isActive: true
            },
            github: {
              uid: profile.id,
              token: accessToken,
            }
          });
          return cb(
            null,
            newUser,
            req.flash("success", transSuccess.loginSuccess(newUser.username))
          );
        } catch (error) {
          console.log(error);
          return cb(
            null,
            false,
            req.flash("errors", transErrorsMessage.SERVER_ERROR)
          );
        }
      }
    )
  );
  passport.serializeUser((user, cb) => {
    //hàm này sẽ ghi thông tin của người dùng vào trong session (thường là ghi id của user)
    cb(null, user._id);
  });
  passport.deserializeUser(async (id, cb) => {
    //Khi request chạy vào middleware passport.session() sẽ lấy thông tin người dùng (id trong session vừa config ở serializeUser) để truyền vào trong callback
    //hàm này sử dụng thông tin để tìm kiếm user => gán user cho req
    try {
      const user = await UserModel.findUserById(id);
      if (user) {
        const chatGroupIds = await ChatGroupModel.getChatGroupIdsUser(user._id);
        user.chatGroupIds = chatGroupIds;
        return cb(null, user);
      }
    } catch (error) {
      console.log(error);
      return cb(error, null);
    }
  });
};

export { initPassportGitHub };

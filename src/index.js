import express from "express";
import ConnectDB from "./config/connectDB";
import connectFlash from "connect-flash";
import initRouters from "./routes/web";
import configViewEngine from "./config/viewEngine";
import bodyParser from "body-parser";
import configSession from "./config/session";
import passport from "passport";
//Init app
const app = express();
//Connect to MongoDB
ConnectDB();
//Config Session
configSession(app);
//Config view engine
configViewEngine(app);
// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));
// Enable flash messages
app.use(connectFlash());
//Config passport
app.use(passport.initialize());
app.use(passport.session());//passport sẽ làm việc với session gọi dữ liệu trong session ra
//init all routes
initRouters(app);

const hostname = "localhost";
const PORT = process.env.PORT || 3000;
app.listen(PORT, hostname, () => {
  console.log("Sever is running....");
});

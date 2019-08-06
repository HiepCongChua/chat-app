import express from "express";
import http from 'http';
import ConnectDB from "./config/connectDB";
import connectFlash from "connect-flash";
import initRouters from "./routes/web";
import configViewEngine from "./config/viewEngine";
import bodyParser from "body-parser";
import { configSession, store as storeSession } from "./config/session";
import passport from "passport";
import { initSockets } from './sockets/index';
import socketio from 'socket.io';
import passportSocketIo from 'passport.socketio';
import cookieParser from 'cookie-parser';
//Init app
const app = express();
//Init server with socket.io & express app
const server = http.createServer(app);
const io = socketio(server);
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
app.use(cookieParser());
//Config passport
app.use(passport.initialize());
app.use(passport.session());//passport sẽ làm việc với session gọi dữ liệu trong session ra
//init all routes
// Cấu hình io để lấy dữ liệu trong session ra (kết hợp sử dụng passport-socket)
initRouters(app);
io.use(passportSocketIo.authorize({
  cookieParser,
  key: process.env.SECRET_SESSION,
  secret: process.env.KEY_SESSION,
  store: storeSession,
  success: (data, accept) => {
    if(!data.user.logged_in){
      return accept("Invalid user .",false);
    }
    return accept(null,true);
  },
  fail: (data, message, error, accept)=>{
    if (error)
      throw new Error(message);
    console.log('failed connection to socket.io:', message);
    accept(null, false);
    if (error) accept(new Error(message));
  }
}));
//Init all sockets
initSockets(io);
const hostname = "127.0.0.1";
const PORT = process.env.PORT || 3000;
server.listen(PORT, hostname, () => {
  console.log("Sever is running....");
});

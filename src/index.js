import express from "express";
import socket_io from 'socket.io';
import http from 'http';
import ConnectDB from "./config/connectDB";
import connectFlash from "connect-flash";
import initRouters from "./routes/web";
import configViewEngine from "./config/viewEngine";
import bodyParser from "body-parser";
import {configSession,store as storeSession} from "./config/session";
import passport from "passport";
import { initSockets } from './sockets/index';
import passportSocketIo from 'passport.socketio';
import cookieParser from 'cookie-parser';
//Init app
const app = express();
//Init server with socket.io & express app
const server = http.createServer(app);
const io = socket_io(server);
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
  cookieParser:cookieParser,
  key: 'express.sid',//key và secret trong lúc cấu hình session phải trùng thì io mới có quyền sử dụng dữ liệu
  secret: 'my_secret',
  store : storeSession,//Sử dụng store trong config session store
  success:(data,accept)=>{
       if(!data.user.logged_in)
       {
         return accept(null,true);
       }
  },
  fail:(data,message,error,accept)=>{
    if(error)
    {
      console.log("Failed connection to socket.io",message);
      return accept(new Error(message),false);
    }
  }
}));
//Init all sockets
initSockets(io);
const hostname = "localhost";
const PORT = process.env.PORT || 3000;
server.listen(PORT, hostname, () => {
  console.log("Sever is running....");
 });

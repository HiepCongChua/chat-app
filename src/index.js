import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";
import initRouters from './routes/web';
import configViewEngine from "./config/viewEngine";
//Init app
const app = express();
//Connect to MongoDB
ConnectDB();
//Config view engine
configViewEngine(app);
//init all routes
initRouters(app);
const hostname = "localhost";
const PORT = process.env.PORT || 3000;
app.listen(PORT, hostname, () => {
  console.log("Sever is running....");
});

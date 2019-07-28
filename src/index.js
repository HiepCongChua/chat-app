import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";
import initRouters from './routes/web';
import configViewEngine from "./config/viewEngine";
import bodyParser from 'body-parser';
//Init app
const app = express();
//Connect to MongoDB
ConnectDB();
//Config view engine
configViewEngine(app);
// Enable post data for request 
app.use(bodyParser.urlencoded({extended:true}));
//init all routes
initRouters(app);
const hostname = "localhost";
const PORT = process.env.PORT || 3000;
app.listen(PORT, hostname, () => {
  console.log("Sever is running....");
});

import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";
import configViewEngine from "./config/viewEngine";
//Init app
const app = express();
//Connect to MongoDB
ConnectDB();
//Config view engine
configViewEngine(app);
const hostname = "localhost";
const PORT = process.env.PORT || 3000;
app.get("/", (req, res, next) => {
  return res.render("main/master");
});
app.get("/login-register", (req, res, next) => {
  return res.render("auth/loginRegister");
});
app.listen(PORT, hostname, () => {
  console.log("Sever is running....");
});

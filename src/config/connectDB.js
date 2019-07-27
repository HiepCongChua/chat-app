import mongoose from 'mongoose';
import bluebird from 'bluebird';
const connectDB = ()=>{
    mongoose.Promise = bluebird;
    const DB_CONNECTION = process.env.DB_CONNECTION;
    const DB_HOST = process.env.DB_HOST;
    const DB_PORT = process.env.DB_PORT;
    const DB_NAME = process.env.DB_NAME;
    // const DB_USERNAME = "";
    // const DB_PASSWORD = "";
    const URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    return mongoose.connect(URI,{useMongoClient:true})
};  
export default connectDB;
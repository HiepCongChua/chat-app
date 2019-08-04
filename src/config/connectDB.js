import mongoose from 'mongoose';
import bluebird from 'bluebird';
const connectDB = ()=>{
    mongoose.set('useFindAndModify', false);
    mongoose.Promise = bluebird;
    const DB_CONNECTION = process.env.DB_CONNECTION;
    const DB_HOST = process.env.DB_HOST;
    const DB_PORT = process.env.DB_PORT;
    const DB_NAME = process.env.DB_NAME;
    // const DB_USERNAME = "";
    // const DB_PASSWORD = "";
    // const URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    const URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@cluster0-kv3pr.mongodb.net/${process.env.DATABASE_NAME}`

    // return mongoose.connect(URI,{useMongoClient:true})
    return mongoose.connect(URI,{ useCreateIndex: true, useNewUrlParser: true });
};  
export default connectDB;
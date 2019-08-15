import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
// import connectMongo from 'connect-mongo'
const MongoStore = connectMongo(session);
// // Session lưu trên cloud
// const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@cluster0-kv3pr.mongodb.net/${process.env.DATABASE_NAME}`;
const MONGODB_URI = `mongodb://${process.env.MONGODB_HOASAO_USER}:${process.env.MONGODB_HOSAO_PW}@vcar.devboo.com:27017/chat-app`;
const store = new MongoStore({
  uri : MONGODB_URI,
  collection : 'sessions'
});
//Session lưu trên local
// const URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
// const store = new MongoStore({
//   url: URI,
//   autoReconnect: true
// });
const configSession = (app) => {
  app.use(session({
    key: process.env.SECRET_SESSION,
    secret: process.env.KEY_SESSION,
    store,
    resave: true,
    saveUninitialized: false,
    cookie:{
      maxAge:1000*60*24
    }    
  }));
}
export {
  configSession,
  store
};
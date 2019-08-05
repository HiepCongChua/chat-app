import session from 'express-session';
// // import connectMongo from 'connect-mongodb-session';
import connectMongo from 'connect-mongo'
const MongoStore = connectMongo(session);

// // Session lưu trên cloud
// // const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@cluster0-kv3pr.mongodb.net/${process.env.DATABASE_NAME}`;
// // const store = new MongoStore({
// //   uri : MONGODB_URI,
// //   collection : 'sessions'
// // });

//Session lưu trên local
const URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const store = new MongoStore({
  url : URI,
  autoReconnect:true
});
const configSession=(app)=>
{
app.use(session({
    secret:'my secret',
    resave:true,
    saveUninitialized:false,
    store : store,
    name : 'chat-app',
    cookie:{maxAge:1000*60*60*24}
}));
}
export default configSession;
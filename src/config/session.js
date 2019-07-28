import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
const MongoStore = connectMongo(session);
const URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const store = new MongoStore({
  uri : URI,
  collection : 'sessions'
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
}))
}
export default configSession;
import express from 'express';
import ConnectDB from './config/connectDB';
import ContactModel from './models/contact.model';
const app = express(); 
ConnectDB();
const hostname = "localhost";
const PORT = process.env.PORT || 3000;
app.get('/',(req,res,next)=>{
    res.send('OK');
});
app.get('/test-database',async(req,res)=>{
    try {
        let item = {
            userId:"34345645",
            contactID:"6534563456"
        }
        let contact = await ContactModel.createNew(item);
        res.send(contact);
    } catch (error) {
        console.log(error);
    }
});
app.listen(PORT,hostname,()=>{
    console.log('Hello world !');
});
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:String,
    gender:{type:String,default:'male'},
    phone : {type:Number,default:null},
    address:{type:String,default:null},
    avatar:{type:String,default:"avatar-default.jpg"},
    role : {type:String,default:"user"},
    local:{
        email : {type:String,trim:true},
        password:String,
        isActive:{type:Boolean,default:false},
        verifyToken:String
    },
    facebook:{
        uid:String,
        token:String,
        email:{type:String,trim:true}
    },
    google:{
        uid:String,
        token:String,
        email:{type:String,trim:true}
    },
    createdAt:{
        type:Number,default:Date.now
    },
    updatedAt:{
        type:Number,default:null
    },
    deletedAt:{
        type:Number,default:null
    },
    activeTime:{
        type:Number,
        default:Date.now()+3600000
    }
});
UserSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    findByEmail(email){
        return this.findOne({'local.email':email}).exec();
    },
    removeById(id){
        return this.findByIdAndRemove(id).exec();
    },
    findByTokenAndActiveTime(token){
        return this.findOne({"local.verifyToken":token,activeTime:{$gte:Date.now()}}).exec();
    },
    verify(token)
    {
        return this.findOneAndUpdate(
            {
                "local.verifyToken":token,
                activeTime:{$gte:Date.now()}
            },
            {
                "local.isActive":true,
                 activeTime:null,
                "local.verifyToken":null
            },
            {
                new:false
            },
        ).exec();
    },
    findUserById(id)
    {
        return this.findById(id);
    },
    findUserByFacebookUid(id){
        return this.findOne({'facebook.uid':id}).exec();
    },
    findUserByGoogleUid(id){
        return this.findOne({'facebook.uid':id}).exec();
    }
};
UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compare(password,this.local.password);
    }
}

export default mongoose.model("user",UserSchema);
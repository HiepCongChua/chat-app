import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username:{type:String,index: true },
    gender:{type:String,default:'male'},
    phone : {type:String ,default:null},
    address:{type:String,default:null},
    avatar:{type:String,default:null},
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
    github:{
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
UserSchema.index({username:'text'})
UserSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    findByEmail(email){
        return this.findOne({'local.email':email}).exec();
    },
    findListContacts(userId,contactId,currentId){//Tìm tất cả mọi người đã kết nối 
        //tức là mình có thể nhận được lời mời và đồng ý mình là contactId người kia là userId
        //hoặc ngược lại mình gửi lời mời và người kia đồng ý mình là userId và người kia là contactId
        //tìm bản ghi thỏa mãn khác với id của mình bởi vì mình có thể là contactId hoặc userId
     return this.find({
         $and:[
             {
                $or:[{_id:userId},{_id:contactId}]
             },
             {
                _id:{$ne:currentId}
             }
         ]
     },{_id:1,username:1,avatar:1,address:1}).exec();
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
        return this.findById(id,{_id:1,username:1,avatar:1,address:1,"google":1,"facebook":1,"github":1});
    },
    findUserByIdForChangePassword(id){
        return this.findById(id);
    },
    findUserByFacebookUid(id){
        return this.findOne({'facebook.uid':id}).exec();
    },
    findUserByGitHubUid(id){
        return this.findOne({'github.uid':id}).exec();
    },
    findUserByGoogleUid(id){
        return this.findOne({'google.uid':id}).exec();
    },
    updateUser(id,item){
        return this.findByIdAndUpdate(id,item).exec();
    },
    updatePassword(id,hashedPassword){
       return this.findByIdAndUpdate(id,{"local.password":hashedPassword}).exec();
    },
    findAllForAddContact(deprecateUserIds,keyword){
        return this.find({
           $and:[
               {"_id":{$nin:deprecateUserIds}},//ID của bản ghi không nằm trong số những id trong mảng này
               {"local.isActive":true},//Trạng thái đã active
            //    {$or:[//Thỏa mãn một trong 2 điều kiện.
            //      {"username":{"$regex":new RegExp(keyword,'i')}},//new RegExp(keyword,'i') tức là không phân biệt chữ hoa thường
            //      {"local.email":{"$regex":new RegExp(keyword,'i')}},
            //      {"facebook.email":{"$regex":new RegExp(keyword,'i')}},
            //      {"google.email":{"$regex":new RegExp(keyword,'i')}}
            //    ]
            //    }
                {$text:{$search:keyword,$caseSensitive:true}}
           ]
        },
        {_id:1,username:1,address:1,avatar:1}).exec();
    }
};
UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compare(password,this.local.password);
    }
}

export default mongoose.model("user",UserSchema);
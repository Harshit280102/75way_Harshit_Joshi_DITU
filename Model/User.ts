import mongoose from "mongoose";


const UserSchema =new mongoose.Schema({
name:{
    type:String,
    required:true,
},
email:{
    type:String,
    required:true,
    unique:true,
},
password:{
    type:String,
    required:true,
},role:{
    type:String,
    enum:['Guest','Admin'],
}});

const User =mongoose.model('user',UserSchema);

export {User};
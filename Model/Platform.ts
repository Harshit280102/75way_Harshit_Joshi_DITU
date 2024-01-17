import mongoose from "mongoose";
const {Schema}=mongoose;


const platformSchema =new mongoose.Schema({
platform_name:{
    type:String,
    required:true,
    unique:true,
},
description:{
    type:String,
    required:true,
},
file:[String],
author:{type:Schema.Types.ObjectId, ref:'User'},
},{
    timestamps:true,
});

const Platform =mongoose.model('platform',platformSchema);

export {Platform};


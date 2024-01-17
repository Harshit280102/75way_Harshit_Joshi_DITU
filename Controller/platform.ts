import {RequestHandler } from 'express';
import { User } from '../Model/User';
import { Platform } from '../Model/Platform';
import { valiadationSchemap } from '../Middleware/Validation';
import jwt from 'jsonwebtoken' ;

//create Platform
export const createPlatform : RequestHandler =async(req,res)=>{
    const {Adminid} =req.body;
    if(!Adminid) {return res.status(500).send("Admin can only create Data")}

    try{
        let user=await User.findOne({_id:Adminid});
    }catch(e){
        res.status(401).send(e);
    }
    
    try {
    let platform =await Platform.findOne({platform_name:req.body.platform_name})
    if(platform) {return res.status(400).send("Platform already Exists!!")}
    } catch (error) {
        res.status(401).send(error);
    }
    
       let user= await User.findById({_id:Adminid});
    
    try{
        try {
            const Platform_create=new  Platform({
                platform_name:req.body.platform_name,
                description:req.body.description,
                author:user?.name
            })

           const api_key = jwt.sign({platformId : Platform_create._id,platformAuthor:Platform_create.author},process.env.JWT_PLATFORM_KEY||" ",) ;

            await Platform_create.save();

            return res.status(200).send(`API_KEY=${api_key}SAVE IT`);
        } catch (error) {
            res.status(401).send("Error in creating new Post")
        }
       
        
    }catch(err){
        res.send("Error In Creating PLatform in the Database");
    }
}

//upload File
export const uploadfile : RequestHandler =async(req,res)=>{
    const {fileUrl,Adminid} =req.body;
    if(!fileUrl) {return res.status(500).send("Cannot Create File In Cloudinary")};

    let platform =await Platform.findOne({platform_name:req.body.platform_name})
    if(!platform) {return res.status(400).send("Platform not present do create it please!!")}
    
    try{
        platform.file.push(fileUrl);

        platform.save();
        return res.status(200).send(`File is Uploaded to Cloudianry URL ${fileUrl}`);
    }catch(err){
        res.send("Error In Saving URL IN DATABASE");
    }
}

//Read all Platforms
export const readPlatform: RequestHandler=async(req,res)=>{
    let platform =await Platform.find();
    res.send(platform);
}







//Test Point
export const test: RequestHandler=async(req,res)=>{
   const result = await User.deleteOne();
    res.send(result);
}
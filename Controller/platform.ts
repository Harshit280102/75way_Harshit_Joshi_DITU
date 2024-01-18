import {RequestHandler } from 'express';
import { User } from '../Model/User';
import {Platform}  from '../Model/Platform';
import { valiadationSchemap } from '../Middleware/Validation';
import jwt from 'jsonwebtoken' ;

//create Platform
export const createPlatform : RequestHandler =async(req,res)=>{
    const mydata :any= req.body;

    if(!mydata.Adminid) {return res.status(500).send("Admin can only create Data")}

    console.log(mydata);
   
        let user=await User.findOne({_id:mydata.Adminid});
        if(!user){res.status(401).send("Admin not Found")}
    
        
   
    
    let platform =await Platform.findOne({platform_name:mydata.platform_name})
    if(platform) {return res.status(400).send("Platform already Exists!!")}

    console.log('sabh chalra');


    

       
    try{
        const newPlatform = new Platform(mydata);

         const result= await newPlatform.save();

            const api_key = jwt.sign({
            platformId : result._id,
            platformAuthor:result.author
        },process.env.JWT_PLATFORM_KEY||" ",) ;

          return res.status(201).json({
            message: 'Platform created successfully',
            platform: newPlatform,
            api_key: api_key
          });
    }catch (error) {
        console.error(error);
        return res.status(500).send("Error in creating the platform");
      }
    
}

//upload File
export const uploadfile : RequestHandler =async(req,res)=>{
    const {fileUrl} =req.body;
    const platform_name=req.params.name;
    
    const Adminid=req.Adminid;
    if(!fileUrl) {return res.status(500).send("Cannot Create File In Cloudinary")};

    let platform =await Platform.findOne({platform_name})
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

    const {Adminid} =req.body;

    let user= await User.findById({_id:Adminid});

    const Platform_create = new Platform ({
        platform_name:req.body.platform_name,
        description:req.body.description,
        file:req.body.file,
        author:user?.name
    })
   const result = await Platform_create.save();

   res.send(result);

}
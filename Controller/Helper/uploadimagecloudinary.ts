import {v2 as cloudinary} from 'cloudinary';
import { NextFunction, Request,Response } from 'express';


          
cloudinary.config({ 
  cloud_name: 'di4jyusxf', 
  api_key: '577412118699267', 
  api_secret: 'HiVzZCHnGAWFvnR2-AROJ4wF1rw' 
});



let uploadImage = async (req:Request, res:Response,next:NextFunction) => {
  try {
        if (req.file) {
          console.log(req.file.path);
          
          const result = await cloudinary.uploader.upload(req.file.path);
          
          req.body.fileUrl=result.secure_url;
          
          next();
        } else {
          res.status(400).json({ message: "No file provided" });
        }
  } catch (error) {
    res.status(400).json({ message: "Image upload failed" });
  }
};

export {uploadImage};
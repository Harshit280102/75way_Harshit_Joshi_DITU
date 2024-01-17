import express,{ NextFunction, Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import { Platform } from '../Model/Platform';
import { User } from "../Model/User";


export const checkUserAccess = async(req: Request, res: Response, next: NextFunction) => {
    const {apikey} =req.params;
    
   try{
    const decoded:any = jwtDecode(apikey);

    const userid=decoded.userId;
    let user =await User.findOne({_id:userid})
    if(decoded.role!=="Admin" || !user){
        res.status(500).send("You are not Admin so you cannot acess the resources")
    }else{
    req.body.Adminid=decoded.userId;
    next();
    }
   
   } catch(err){
    res.send("Not Admin")
   }
}
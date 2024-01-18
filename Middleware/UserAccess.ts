import express,{ NextFunction, Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import { Platform } from '../Model/Platform';
import { User } from "../Model/User";
import { platform } from "os";


export const checkUserAccess = async(req: Request, res: Response, next: NextFunction) => {
    const apikey =req.params.apikey;
    try{
        const decoded:any = jwtDecode(apikey);
        const {platformId,platformAuthor}=decoded;
    
        if(!platformId){return res.status(500).send("Wrong Api Key")};
        if(!platformAuthor){return res.status(500).send("Wrong Api Key")};
    
        const user=await Platform.findOne({_id:platformId});
    
        if(!user){
            return res.status(500).send("Wrong Api Key");
        }else{
            req.body.platform =user;
            next();
        }
    }catch(err){
        return res.status(500).send("Na Bhai kux gadbad hn dekh le tu");
    }
}
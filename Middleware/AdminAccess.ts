import express,{ Express,NextFunction, Request, Response } from "express";
import { any } from "joi";
import jwt from 'jsonwebtoken' ;
import { jwtDecode } from "jwt-decode";


export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.cookies.authToken ;   
    const refreshToken = req.cookies.refreshToken ;
    
    if(!authToken || !refreshToken){
        return res.status(401).json({message : " Authentication Failed : No authToken or refreshToken is provided "})
    }

   try{
    const decoded:any = jwtDecode(authToken);
    if(decoded.role!=="Admin"){
        res.status(500).send("You are not Admin so you cannot acess the resources")
    }else{
     req.body.Adminid=decoded.userId;
    next();
    }
   
   } catch(err){
    res.send("Not Admin")
   }
}

// export const checkCreater = (req: Request, res: Response, next: NextFunction) => {
//     const authToken = req.cookies.authToken ;   
//     const refreshToken = req.cookies.refreshToken ;
        
//     if(!authToken || !refreshToken){
//         return res.status(401).json({message : " Authentication Failed : No authToken or refreshToken is provided "})
//     }
    // }



    // jwt.verify(authToken,process.env.JWT_SECRET_KEY||"",(err:any,decode:any)=>{
    //     if(decode.role!=="Admin"){
    //         res.status(500).send("You are not Admin so you cannot acess the resources")
    //     }else{
    //         console.log(decode.role);
            
    //         req.body.Adminid=decode.userId;
    //         next();
    //     }
    // })
import {Router,RequestHandler } from 'express';
import { User } from '../Model/User';
import bcrypt from 'bcrypt';
import { valiadationSchema } from '../Middleware/Validation';
import jwt from 'jsonwebtoken';




// User Registeration   
export const registerUser : RequestHandler = async (req,res) => {
    try{
        const result =await valiadationSchema.validateAsync(req.body)
    }catch(err){
        res.status(402).send(err);
    }
    
    
    let user=await User.findOne({email:req.body.email});
    if(user) {return res.status(400).send("User already Registered 🟣")};
    
    try{
        const User_create=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            role:req.body.role, 
        });

        const salt = await bcrypt.genSalt(10);
        User_create.password=await bcrypt.hash(User_create.password,salt);
    
        
        await User_create.save();

        const name:String = req.body.name;
        console.log(`${name} is Created Into The Database 🟢`);
        res.status(200).json(User_create);
    }catch(e){
        console.log('Error in Creating User In the Database! 🔴');
    }
}

// User SignUp 
export const SignUp : RequestHandler = async (req,res,next) => {
    try{
        const {email,password} = req.body ;

        const user = await User.findOne({email});

        
        if(!user){
            return res.status(400).json({ok:false,message:"Invalid Credentials"}) ;
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password) ;
        if(!isPasswordMatch){
            return res.status(400).json({ok:false,message:"Invalid Credentials"}); 
        }
        const authToken = jwt.sign({userId : user._id,role:user.role},process.env.JWT_SECRET_KEY||" ",{expiresIn : '30m'}) ;
        const refreshToken = jwt.sign({userId : user._id,role:user.role},process.env.JWT_REFRESH_SECRET_KEY||" ",{expiresIn : '2h'}) ;

        res.cookie('authToken',authToken,({httpOnly : true})) ;
        res.cookie('refreshToken',refreshToken,({httpOnly:true})) ;
        console.log(authToken);
        return res.status(200).json({ok:true,message : "Login Successful",userid:user.id}) ;

    }
    catch(err){
        next(err) ;
    }
}
//user Logout
export const logoutUser : RequestHandler = async (req,res,next) => {
    try{
        res.clearCookie('authToken') ;
        res.clearCookie('refreshToken') ;
        return res.status(200).json({ok:true,message:"User has been logged out"}) ;
    }
    catch(err) {
        next(err) ;
    }
}


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from 'body-parser' ;
import cors from 'cors' ;
import cookieParser from 'cookie-parser' ;
import {registerUser,SignUp,logoutUser}  from './Controller/user';
import {createPlatform} from './Controller/platform';
import {checkAdmin} from './Middleware/AdminAccess';
import {checkUserAccess} from './Middleware/UserAccess';
import {uploadImage} from './Controller/Helper/uploadimagecloudinary';
import {upload} from './Controller/Helper/uploadimagemulter';
import {uploadfile} from './Controller/platform';
import {readPlatform,test} from './Controller/platform';


dotenv.config();

declare global {
    namespace Express {
      interface Request {
        userId?: string ;
        Adminid?:string;
      }
    }
  }

const connection=process.env.TS_MONGODB_CONNECT;

const app=express();
app.use(express.json());
app.use(cors({
    credentials : true , 
}))

app.use(bodyParser.json()) ;
app.use(cookieParser()) ;


app.post('/register',registerUser );  //okay Tested
app.post('/signup',SignUp);           //okay Tested
app.delete('/logout',logoutUser);     //okay Tested
app.post('/createPlatform',checkAdmin,createPlatform)    //okay Tested
app.post('/upload/:name',checkAdmin,upload.single('image'), uploadImage,uploadfile)
app.get('/platforms',checkAdmin,readPlatform);
app.get('/platforms/userwithapi/:apikey',checkUserAccess,readPlatform) //Users With the api_key can only access the database
app.post('/upload/userwithapi/:apikey',checkUserAccess,upload.single('image'),uploadImage,uploadfile)



app.post("/test",test)
app.get("/test",checkAdmin,test)


app.get("/",(req:any,res:any)=>{
  res.send("Hello This Is The S3 Bucket Server By Harshit Joshi");
})

app.listen(process.env.TS_PORT_KEY,async()=>{
    await connect_to_db(connection);
    console.log(`Server is Running at Port ${process.env.TS_PORT_KEY} `);
});

async function connect_to_db(connection:string |undefined){
    if(typeof connection!== "string"){
        console.log(`Error In Connecting Database To Server Due TO wrong Connection Key `);
        return;
    }
    try{ 
        await mongoose.connect(connection);
        console.log(`Database Is Connecting To Server:${process.env.TS_PORT_KEY} `);
    }catch(e){
        console.log(`Error In Connecting Database To Server:${process.env.TS_PORT_KEY} `);
        }
    }


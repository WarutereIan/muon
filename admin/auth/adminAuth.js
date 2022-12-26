import pkg from 'jsonwebtoken'
import { compare, hash } from 'bcrypt' 
import Admin from '../models/Admin.js'
import * as dotenv from 'dotenv'
import services from '../services/services.js'
dotenv.config()

const { sign, verify, JsonWebTokenError } = pkg
const SECRET_KEY = process.env.SECRET_KEY


//provides auth functions
const adminAuth ={
    login: async (req,res,next)=>{
    var admin

    const {adminname,pass,email} = req.body
    if(adminname){
        admin = await Admin.findOne({adminname})

    }
    else if(email){
        admin = await Admin.findOne({email})
    }
    else if(!pass){
            return res.json({"error":true,"error-message":"password cannot be blank","login-success":false})
    }
    else{
        return res.json({"error":true,"error-message":"Please provide an adminname or email", "login-success":false})
    }
    
    if(!admin){
        //include custom error handling
        return res.json({"error":true,"error-message":"adminname or email incorrect","login-success":false})
    }

    const hashed = admin.password
    const adminId = admin._id
    const lastlogin = new Date()


    var rightPassword = await compare(pass,hashed)

    //generate user login token if password is correct
    if(rightPassword){
    const token = sign({adminId},SECRET_KEY,{expiresIn: '1h'}) 
    //update user session token
    Admin.findOneAndUpdate({_id:adminId},{sessionToken: token,lastlogin: lastlogin, }, (err,res)=>{
        if(err){
            console.log(err)
        }

        console.log('token updated succesfully')
    })
    
   
    return res.json({"error":false,"error-message":"","login-success":true,"adminDetails": admin})
    }
    else{
        res.json({"error":true,
        "error-message":"invalid password",
        "login-success":false,        
        "adminName":admin.adminname,
        "email":admin.email})
    }
}, 
signup: async (req,res)=>{
    try{
    //referralId is equivalent to userId
    const {adminname,pass,email,fullname} = req.body
    
    const emailRegisteredBool = await Admin.findOne({email})
    const adminnameTakenBool = await Admin.findOne({adminname})

    if(!adminname || !pass || !email ||!fullname){

        return res.json({"error":true,"error-message":'please enter all credentials',"signup-success":false})
    }  

    if(emailRegisteredBool){
       return res.json({"error":true,"error-message":'email already registered',"signup-success":false})
    }
    if(adminnameTakenBool){
        return res.json({"error":true,"error-message":"adminname already taken","signup-success":false})
    }    
    
    
    const password = await hash(pass,10) 
    const lastlogin = new Date()
    //create user document
    let admin = await newAdmin(adminname,password,email,lastlogin, fullname)

    
    const dirtyadminId =  JSON.stringify(admin._id)
    const adminId = dirtyadminId.replace(/([^a-z0-9]+)/gi, '')
   
    
    await services.firstTimeSignup(admin,req,res)
    //generate token to keep admin signed in
    const token = await sign({adminId},SECRET_KEY,{expiresIn: '1h'})
    console.log(`admin token: ${token}`)
    //update user session token
    admin = await Admin.findOneAndUpdate({_id:adminId},{sessionToken: token,lastlogin: lastlogin})
    res.json({
    "error":false,"error-message":"",
    "signup-success":true,
    "email-validation":admin.verified,
    "adminDetails": admin,})
    }
    catch(error){
        console.log(error)
        res.send(error)
    }

},

resetPassword: async (req,res)=>{
    const {uid} = req.params
    const {oldPassword,newPassword,newPasswordConfirmation} = req.body

    if(newPassword !== newPasswordConfirmation){
        return res.json({
            "error":true,
            "error-message":"Provided new passwords do not match",
            "password-change-success":false
        })
    }

    else if(oldPassword==newPassword || oldPassword==newPasswordConfirmation){
        return res.json({
            "error":true,
            "error-message":"New password cannot be old password",
            "password-change-success":false
        })
    }

    else{
        var passwordReplacement = await hash(newPassword,10)
        const admin = await Admin.findByIdAndUpdate({_id:uid},{password: passwordReplacement})

        return res.json({
            "error": false,
            "error-message":"",
            "password-change-success": true,
            "admin-details": admin

        })
    }
}, 

//verify that session is still on
sessionAuth: async (req,res,next)=>{
    const {uid} =  req.params
    const admin = await Admin.findOne({_id:uid},{sessionToken:1})
    const token = admin.sessionToken
    
    
    try{
        await verify(token, SECRET_KEY)
    }
    catch(e){
        if (e instanceof JsonWebTokenError){
            console.log(e)
            return res.status(400)
            .json({"error":true,"error-message":"admin online session timed out. Please login again"})
        }
    }
    
        return    next()    
    }
    
}

async function newAdmin(adminname,password,email,lastlogin,fullname) {
    try{
       return  await Admin.create({adminname,password,email,lastlogin,fullname})
        
        }
                catch(error){
                    console.log(error);
                }}

                

export default adminAuth



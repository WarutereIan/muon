import * as dotenv from 'dotenv'
import User from '../models/User.js'
import OTP from 'automatic-otp'
// import auth from '../controllers/auth.js'
import nodemailer from 'nodemailer'
dotenv.config()


const otp = new OTP() 
const otpObject = otp.generate(6,{alphabet:false,specialCharacters:false})


//const secret = 'EBSDMIALAALRA2LP'
let token


const services = {
     sendOTP:  async (req, res)=>{
        try{
        const {uid} = req.params

        const user = await User.findOne({_id:uid},{email:1, verified:1})
        
        
        if(user.verified){
            return res.json({"error":true,"error-message":"Email already verified"})
        }
        const email = user.email
        
        token =  otpObject.token
        console.log(`OTP generated:${token}`)
    
        console.log(typeof token)

        const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
                user: "axtrumpay@outlook.com",
                pass: "Admin_Dominic_98"
            }
        })
    const options = {
    from: 'axtrumpay@outlook.com',
    to: email,
    subject: 'AxtrumPay OTP verification',
    text: `Your One-Time verification Code is: ${token}`
    }

    transporter.sendMail(options, (error,info)=>{
        if(error) {console.log(error)
        return res.json({"error":true,"error-message":"error sending email"})}
        else {
            console.log(info)
        return res.json({"error":false, "error-message":'Verification email sent'})
        }})

    
    }
catch(err){
    console.error(err)
    res.json({"error":true,"error-message":err})
}}
,

    verifyOTP:async (req, res)=>{
        
        const {verificationCode} = req.body
        const {uid} = req.params

        if(!verificationCode){
            return res.json({"error":true,"error-message":'enter verificationCode'})
        }
        try{     
        
            if(verificationCode == token){
                const user = await User.findOneAndUpdate({_id:uid},{verified: true})
                return res.json({"error":"false", "userDetails":user })
            }
            else{
                res.json({"error":true,"error-message":"Invalid verification code. Please try again"})
            }
            
        }
        catch(error){
            console.log(error)
            res.json({"error":true,"error-message":error})
        }
        }
    ,
    firstTimeSignup: async (user,req,res)=>{
        
        const uid = user._id
        const email = user.email
        try{
        if(user.verified){
            return res.json({"error":true,"error-message":"Email already verified"})
        }

        token =  otpObject.token

        const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: "axtrumpay@outlook.com",
            pass: "Admin_Dominic_98"
            }
        })
    const options = {
    from: 'axtrumpay@outlook.com',
    to: email,
    subject: 'AxtrumPay verification',
    text: `Click on the link below to verify your email:
        http://20.29.125.247:80/api/signup/${uid}/first-time-verification/${token}`
    }
    
    transporter.sendMail(options, (error,info)=>{
        if(error) {
            console.log(`error sending message: ${error}`)
        }
        else {
            console.log(`verification email sent with below details: 
                        ${info}`)
        }})
    }
    catch(err){
        console.error(err)
        res.json({"error":true,"error-message":err})
    }}
    
    ,
    emailLinkVerification: async (req,res)=>{
        const {uid,token} = req.params
        
        try{     
        
            if(token == otpObject.token){
                const user = await User.findOneAndUpdate({_id:uid},{verified: true})
                
                return res.send('Email verified successfully')
            }
            else{
                res.send('Error verifying email: Code timed out. Please try again')
            }
            
        }
        catch(error){
            console.log(error)
            res.json({"error":true,"error-message":error})
        }
    }
}

export default services
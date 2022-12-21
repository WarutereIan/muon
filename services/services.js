import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
import User from '../models/User.js'
import OTP from 'automatic-otp'
import auth from '../controllers/auth.js'
dotenv.config()

const otp = new OTP() 



const secret = 'EBSDMIALAALRA2LP'
let validity,token


const services = {
     sendOTP:  async (req, res)=>{
        const {uid} = req.params

        const user = await User.findOne({_id:uid},{email:1, verified:1})
        
        if(user.verified){
            return res.json({"error":true,"error-message":"Email already verified"})
        }
        const email = user.email
        const otpObject = otp.generate(6,{alphabet:false,specialCharacters:false})
        token =  otpObject.token
        console.log(`OTP generated:${token}`)
    
        console.log(typeof token)

        const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
                user: "nmwanik111@gmail.com",
                pass: "Kaminukia1@"
            }
        })
    const options = {
    from: 'nmwanik111@gmail.com',
    to: email,
    subject: 'AxtrumPay OTP verification',
    text: `Your One-Time verification Code is: ${token}`
    }

    transporter.sendMail(options, (error,info)=>{
        if(error) {console.log(error)
        res.send("error. contact systems admin")}
        else {
            console.log(info)
        res.send('Verification email sent')
        }})

    
    }
,

    verifyOTP:async (req, res)=>{
        const {verificationCode} = req.body
        const {uid} = req.params

        if(!verificationCode){
            return res.json({"error":true,"error-message":'enter verificationCode'})
        }
        try{     
        
            if(verificationCode == token){
                User.findOneAndUpdate({_id:uid},{verified: true},(err,res)=>{
                    if(err){
                        console.log(err)
                    }
                    console.log(res)
                })
                res.json({"error":"false", user: res})
            }
            else{
                res.json({"error":true,"error-message":"Invalid verification code. Please try again"})
            }
            
        }
        catch(error){
            console.log(error)
        }
    }
}

export default services
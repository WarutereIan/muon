import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
import User from '../models/User'
import { authenticator, totp } from 'otplib'
dotenv.config()

const PASS = process.env.PASS
const USER = process.env.USER

const secret = authenticator.generateSecret()

export const services = {
     sendOTP:  async (req, res)=>{
        const {uid} = req.params
        const user = await User.findOne({uid},{email:1})
        const email = user.email
        const token = totp.generate(secret)

        const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
                user: USER,
                pass: PASS
            }
        })
    const options = {
    from: 'nmwanik111@gmail.com',
    to: email,
    subject: 'AxtrumPay OTP verification',
    text: `Your One-Time verification Code is: ${token}`
    }

    transporter.sendMail(options, (error,info)=>{
        if(error) console.log(error)
        else console.log(info)
        res.send('Verification email sent')
        })

    
    }
,

    verifyOTP:async (req, res)=>{
        const {verificationCode} = req.params
        try{
            const isValid = totp.verify({verificationCode,secret})
            const {uid} = req.params
            const user = await User.findOneAndUpdate({_id:uid},{verified: true})
            console.log(user)
            if(isValid){
                res.send("Verification successful")
            }
            
        }
        catch(error){
            console.log(error)
        }
    }
}









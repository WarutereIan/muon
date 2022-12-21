import pkg from 'jsonwebtoken'
import { compare, hash } from 'bcrypt' 
import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import ethersFunctions from '../config/ethersConfig.js'
import * as dotenv from 'dotenv'
dotenv.config()

const { sign, verify, JsonWebTokenError } = pkg
const SECRET_KEY = process.env.SECRET_KEY

//provides auth functions
const auth ={
    login: async (req,res,next)=>{
    var user

    const {username,pass,email} = req.body
    if(username){
        user = await User.findOne({username})

    }
    else if(email){
        user = await User.findOne({email})
    }
    else{
        return res.json({"error":true,"error-message":"enter email or password"})
    }
    
    if(!user){
        //include custom error handling
        return res.json({"error":true,"error-message":"unregistered user"})
    }

    const hashed = user.password
    const userId = user._id
    const lastlogin = new Date()


    var rightPassword = await compare(pass,hashed)

    //generate user login token if password is correct
    if(rightPassword){
    const token = sign({userId},SECRET_KEY,{expiresIn: '1h'}) 
    //update user session token
    User.findOneAndUpdate({_id:userId},{sessionToken: token,lastlogin: lastlogin}, (err,res)=>{
        if(err){
            console.log(err)
        }

        console.log('token updated succesfully')
    })
    
   
    return res.json({"error":false,"userDetails": user})
    }
    else{
        res.json({"error":true,"error-message":"invalid password"})
    }
}, 
signup: async (req,res)=>{
    try{
    //referralId is equivalent to userId
    const {username,pass,email,referredBy,country, fullname} = req.body
    
    const emailRegisteredBool = await User.findOne({email})
    const usernameTakenBool = await User.findOne({username})

    if(!username || !pass || !email || !referredBy || !country ||!fullname){
        return res.json({"error":true,"error":'please enter all credentials'})
    }  

    if(emailRegisteredBool){
       return res.json({"error":true,"error":'email already registered'})
    }
    if(usernameTakenBool){
        return res.json({"error":true,"error":"username already taken"})
    }

    n
    
    
    const walletObject = await ethersFunctions.createWallet()
    
    const   address= walletObject.address,
            mnemonic_phrase = walletObject.mnemonic.phrase,
            privateKey = walletObject.privateKey
    

    console.log(`wallet created at address ${address}`)
    const password = await hash(pass,10) 
    const lastlogin = new Date()
    //create user document
    const user = await newUser(username,password,email,referredBy,country,lastlogin, fullname)

    
    const dirtyuserId =  JSON.stringify(user._id)
    const userId = dirtyuserId.replace(/([^a-z0-9]+)/gi, '')
    //create wallet document with all fields filled in
    const wallet = await Wallet.create({userId,address,mnemonic_phrase,privateKey})
    console.log(`wallet created in db successfully`)
    
    //update user document with wallet id
    await User.findOneAndUpdate({username:username},{wallet: wallet._id}).exec()
    //find person who referred new user and add new user to their list of referrals
    if(referredBy){

        User.findOneAndUpdate({_id: referredBy}, {$push:{usersReferred:userId}}).exec()
     }
    
    //generate token to keep user signed in
    const token = await sign({userId},privateKey,{expiresIn: '1h'})
    //update user session token
    User.findOneAndUpdate({username:username},{sessionToken: token},(err,res)=>{
        if(err) console.log(err)
        console.log(res)
    })
    res.json({"error":false,"userDetails": user,})
    }
    catch(error){
        console.log(error)
        res.send(error)
    }

},
//verify that session is still on
sessionAuth: async (req,res,next)=>{
    const {uid} =  req.params
    const user = await User.findOne({_id:uid},{sessionToken:1})
    const token = user.sessionToken
    
    try{
        payload = verify(token, SECRET_KEY)
    }
    catch(e){
        if (e instanceof JsonWebTokenError){
            console.log(e)
            return res.status(400)
            .json({"error":true,"errorMessage":"User session timed out"})
        }
    }
    
        return    next()    
    }
    
}

async function newUser(username,password,email,referredBy,country,lastlogin,fullname) {
    try{
       return  await User.create({username,password,email,referredBy,country,lastlogin,fullname})
        
        }
                catch(error){
                    console.log(error);
                }}

                

export default auth



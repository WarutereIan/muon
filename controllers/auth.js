import pkg from 'jsonwebtoken'
import { compare, hash } from 'bcrypt' 
import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import ethersFunctions from '../config/ethersConfig.js'
import * as dotenv from 'dotenv'
dotenv.config()

const { sign, verify, JsonWebTokenError } = pkg
const SECRET_KEY = process.env.SECRET_KEY
var payload

//provides auth functions
const auth ={
    login: async (req,res,next)=>{
    const {username,pass} = req.body
    const user = await User.findOne({username})
    
    if(!user){
        //include custom error handling
        return res.send('unregistered user')
    }

    const hashed = user.password
    const userId = user._id
    const lastlogin = new Date()


    var rightPassword = await compare(pass,hashed)

    //generate user login token if password is correct
    if(rightPassword){
    const token = sign({userId},SECRET_KEY,{expiresIn: '1h'}) 
    //update user session token
    User.findOneAndUpdate({username:username },{sessionToken: token,lastlogin: lastlogin}, (err)=>{
        if(err){
            console.log(err)
        }
        console.log('token updated succesfully')
    })
    
   
    return res.json({"userid": userId,"login_success":"true"})
    }
    else{
        res.send('invalid password')
    }
}, 
signup: async (req,res)=>{

    //referralId is equivalent to userId
    const {username,pass,referralId} = req.body
    
    if(!username || !pass){
        res.status(401).send('please enter credentials')
    }  
    
    
    const walletObject = await ethersFunctions.createWallet()
    
    const   address= walletObject.address,
            mnemonic_phrase = walletObject.mnemonic.phrase,
            privateKey = walletObject.privateKey
    

    console.log(address)
    const password = await hash(pass,10) 
    const lastlogin = new Date()
    //create user document
    const user = await User.create({username,password,lastlogin})
    const dirtyuserId =  JSON.stringify(user._id)
    const userId = dirtyuserId.replace(/([^a-z0-9]+)/gi, '')
    //create wallet document with all fields filled in
    const wallet = await Wallet.create({userId,address,mnemonic_phrase,privateKey})
    
    //update user document with wallet id
    await User.findOneAndUpdate({username:username},{wallet: wallet._id}).exec()
    //find person who referred new user and add new user to their list of referrals
    if(referralId){

        User.findOneAndUpdate({_id: referralId}, {$push:{usersReferred:userId}}).exec()
     }
    
    //generate token to keep user signed in
    const token = await sign({userId},privateKey,{expiresIn: '1h'})
    //update user session token
    await User.findOneAndUpdate({username:username},{sessionToken: token}).exec()
    res.json({"userid": userId,"signup_success":"true"})

},
sessionAuth: async (req,res,next)=>{
    const {uid} =  req.params
    const user = await User.findOne({_id:uid},{sessionToken:1})
    const token = user.sessionToken
    
    try{
        payload = verify(token, SECRET_KEY)
        console.log(payload)
    }
    catch(e){
        if (e instanceof JsonWebTokenError){
            console.log(e)
        }
    }
    const nowUnixSeconds = Math.round(Number(new Date())/1000)
    /*this here will determine auto logout time, requiring user to login
     default will be 1h*/
    if (payload.exp - nowUnixSeconds < 1*60*60){
        console.log('login ok')
        return    next()    
    }
    return res.status(400)
            .json({"loggedIn": false})
    
}
}

export default auth



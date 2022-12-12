const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 
const User = require('../models/User')
const mongoose = require('mongoose')
const{ethers} = require('ethers')
require('dotenv').config()


const privateKey = process.env.SECRET_KEY

//provides auth functions
const auth ={
    login: async (req,res,next)=>{
    const {username,password} = req.body
    const user = await User.findOne({username})
    
    if(!user){
        //include custom error handling
        return res.send('unregistered user')
    }

    const hashed = user.password
    const userId = user._id

    //generate user login token if password is correct
    if(await bcrypt.compare(password,hashed)){
    const token = jwt.sign({userId},privateKey,{expiresIn: '1h'}) 
    //update user session token
    await user.updateOne({ },{sessionToken: token}, (err)=>{
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
    
    
    const wallet = ethers.Wallet.createRandom()
    const password = await bcrypt.hash(pass,10) 
    const lastlogin = new Date()
    const user = await User.create({username,password,wallet,lastlogin})
    const userId =  user._id
    //find person who referred new user and add new user to their list of referrals
    if(referralId){

        User.findOneAndUpdate({_id: referralId}, {$push:{usersReferred:userId}}).exec()
     }
    
    //generate token to keep user signed in
    const token =jwt.sign({userId},privateKey,{expiresIn: '1h'})
    user.sessionToken = token
    res.json({"userid": userId,"signup_success":"true"})

},
sessionAuth: async (req,res,next)=>{
    const {uid} =  req.params
    const user = await User.findOne({uid})
    const token = user.sessionToken
    try{
        payload = jwt.verify(token, privateKey)
    }
    catch(e){
        if (e instanceof jwt.JsonWebTokenError){
            console.log(e)
        }
    }
    const nowUnixSeconds = Math.round(Number(new Date())/1000)
    if (payload.exp - nowUnixSeconds > 1*60*60){
        res.satus(400)
            .json({loggedIn: false})
    }
    next()
    
}
}

module.exports = auth



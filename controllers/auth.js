const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 
const User = require('../models/User')
const Wallet = require('../models/Wallet')
const ethersFunctions = require('../config/ethersCOnfig')
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
    
    
    const walletObject = await ethersFunctions.createWallet()
    
    const   address= walletObject.address,
            mnemonic_phrase = walletObject.mnemonic.phrase,
            privateKey = walletObject.privateKey
    

    console.log(mnemonic_phrase)
    const password = await bcrypt.hash(pass,10) 
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
    const token = await jwt.sign({userId},privateKey,{expiresIn: '1h'})
    //update user session token
    await User.findOneAndUpdate({username:username},{sessionToken: token}).exec()
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



const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 
const User = require('../models/User')
const mongoose = require('mongoose')
const{ethers} = require('ethers')
require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 
const User = require('../models/user')
const mongoose = require('mongoose')
require('dotenv').config()

const privateKey = process.env.SECRET_KEY

const auth ={
    login: async (req,res,next)=>{
    const {email,password} = req.body

    console.log(req.session.token)
    
    if(req.session.token){
        return res.send('you are already logged in')
    }
    
    const user = await User.findOne({email})
    
    if(!user){
        //include custom error handling
        return res.send('unregistered email')
    }

    const hashed = user.password
    const userId = user._id
    if(await bcrypt.compare(password,hashed)){
    const token = jwt.sign({userId},privateKey,{expiresIn: '1h'}) 
    req.session.token = token
    return res.send('logged in successfully')
    }
    else{
        res.send('invalid password')
    }
}, 
signup: async (req,res)=>{
    const {email,pass} = req.body
    
    if(!email || !pass){
        res.status(401).send('please enter credentials')
    }  
    
    const wallet = ethers.Wallet.createRandom()
    const password = await bcrypt.hash(pass,10) 
    const user = await User.create({email,password,wallet})
    const userId =  user._id
    const token =jwt.sign({userId},privateKey,{expiresIn: '1h'})
    req.session.token = token
    res.send('user created succesfully')

}
}



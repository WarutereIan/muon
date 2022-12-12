const User = require('../models/User')
require('dotenv').config()
const mongoose = require('mongoose')

const usersArray = []
const MONGO_URI = process.env.MONGO_URI

console.log(MONGO_URI)


mongoose.connect(MONGO_URI,
    (err)=>{
        if(err){
            return console.log(err)
        }
        console.log('connected to db successfully')
    })

//query all users  from db and push them to array
getUser = async()=>{for await (const user of User.find()){
    console.log(user)
}}

getUser()
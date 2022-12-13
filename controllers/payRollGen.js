
const User = require('../models/User')
const Wallet = require('../models/Wallet')
require('dotenv').config()
const mongoose = require('mongoose')
const { use } = require('chai')


/*
will generate list of user accounts payable per day
*/


const usersArray = []

const MONGO_URI = process.env.MONGO_URI

var i = 0, j = 0

mongoose.connect(MONGO_URI,
    (err)=>{
        if(err){
            return console.log(err)
        }
        console.log('connected to db')
    })

//query all users  from db and push them to array if logged in in last 24h
 module.exports = async function getUsers (){

    try{
    for await (const user of User.find()){
    const id = JSON.stringify(user._id)
    const userId = id.replace(/([^a-z0-9]+)/gi, '')

    //combine differenceInh into a function
   const lastloginInstance = user.lastlogin
   const timeNow = new Date()
    const difference = timeNow - lastloginInstance
    const differenceInh = difference/(60*60*1000)    

    if(differenceInh > 15){
         usersArray.push(userId)
         }
    
        
    }
    /*this section below somehow makes the try-catch block
    work synchronously*/
    i++
    ++j
    if(i==j){
    }
    }


catch(e){
    console.log(e)
}
return usersArray
}




    









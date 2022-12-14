
import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import * as dotenv from 'dotenv'
dotenv.config()
import { connect } from 'mongoose'
import { use } from 'chai'


/*
will generate list of user accounts payable per day
*/


const usersArray = []

const MONGO_URI = process.env.MONGO_URI

var i = 0, j = 0

connect(MONGO_URI,
    (err)=>{
        if(err){
            return console.log(err)
        }
        console.log('connected to db')
    })

//query all users  from db and push them to array if logged in in last 24h
  async function getUsers (){

    try{
    for await (const user of User.find({},{
        password: 0,
        wallet: 0,
        sessionToken: 0
    })){
        
    const id = JSON.stringify(user._id)
    const userId = id.replace(/([^a-z0-9]+)/gi, '')

    /*differenceInh gives the period after which users logins are to be checked*/
   const lastloginInstance = user.lastlogin
   const timeNow = new Date()
    const difference = timeNow - lastloginInstance
    const differenceInh = difference/(60*60*1000)    

    if(differenceInh < 10){
         usersArray.push({"userId":userId,"referrals":BigInt(user.usersReferred.length)})
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

export default getUsers


//list of active miners and their referred active miners is populated in this module

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

var i = 0, j = 0,activeReferralCount = 0

connect(MONGO_URI,
    (err)=>{
        if(err){
            return console.log(err)
        }
        console.log('connected to db')
    })

//query all verified users  from db and push them to array if logged in in last 24h
  async function getUsers (){

    try{
    for await (const user of User.find({verified: true, miningStatus: true},{
        password: 0,
        wallet: 0,
        sessionToken: 0
    })){
        
    const id = JSON.stringify(user._id)
    const userId = id.replace(/([^a-z0-9]+)/gi, '')

    /*differenceInh gives the period after which users logins are to be checked. No longer relevant in new iteration*/
   const lastloginInstance = user.lastlogin
   const timeNow = new Date()
    const difference = timeNow - lastloginInstance
    const differenceInh = difference/(60*60*1000)    

    if(differenceInh < 1){

        for await(const referredMiner of User.find({_id: user.usersReferred[i]})){
            if(referredMiner.miningStatus){
                activeReferralCount++
            }
        }   

         usersArray.push({"userId":userId,"referrals":activeReferralCount})
         activeReferralCount = 0
        } 
    }
    /*this section below somehow makes the try-catch block
    work synchronously*/
    i++
    ++j
    if(i==j){
    }
    console.log(`payable users are as below:
    `)
    console.log(usersArray)
    }
catch(e){
    console.log(e)
}

return usersArray
}

export default getUsers


const User = require('../models/User')
require('dotenv').config()
const mongoose = require('mongoose')

/*create map in which values are stored by key:value pairs. the map's 
key type is maintained, luckily our wallet address is a string.
the key to be passed 
in this case the key is the 
*/
const usersArray = []
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI,
    (err)=>{
        if(err){
            return console.log(err)
        }
        console.log('connected to db successfully')
    })

//query all users  from db and push them to array
getUsers = async ()=>{for await (const user of User.find()){
   const userObject = user.toJSON()
   const walletObject = (userObject.wallet)
   console.log(walletObject.address)
    
    usersArray.push({wallet: user.wallet, 
        lastlogin:user.lastlogin})
    

}}

getUsers()


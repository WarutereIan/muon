const getUsers = require( "./payRollGen.js")
const Wallet = require('../models/Wallet')
var walletsArray = []
var userids = []
var i = 0

getUserIds = async()=>{
    const arr = await Promise.all([getUsers()])
    userids = arr[0]
    
    for(const uid of userids){
    const wallet = await Promise.all([Wallet.find({uid},{address: 1})])
    walletsArray.push(wallet[0][0].address)
    i++
   
    }
    console.log(walletsArray.length)
    console.log(`i: ${i}`)
}



getUserIds()



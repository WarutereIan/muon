const getUsers = require( "./getPayableUsers.js")
const Wallet = require('../models/Wallet')

var userids = []
var walletsArray = []
var wallet
var uid


module.exports =  getPayableWallets = async()=>{
    const arr = await Promise.all([getUsers()])
   
    userids = arr[0]
    console.log(`userids length: ${userids.length}`)
    var i = 0

    for (const userObj of userids){
    uid = userObj["userId"]
    console.log(`userid: ${uid}`)

    wallet = await Wallet.findOne({userId:uid},{address: 1})
    if(wallet){
        walletsArray.push({"address":wallet.address,"referrals":userObj["referrals"]})
    if(i == userids.length - 1){
        console.log(walletsArray)
        return walletsArray
    }   
    }    
    i++
}
 }






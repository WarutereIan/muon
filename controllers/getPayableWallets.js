//wallets are paid out in this module every hour

import getUsers from "./getPayableUsers.js"
import Wallet from '../models/Wallet.js'
import { BigNumber, ethers } from 'ethers'
import { contract, OwnerWallet,provider } from '../config/ethersConfig.js'

var userids = []
var amountsArray = []
var walletsArray = []
var wallet
var uid
var amountInt
var amount

var constRate = BigInt(1*10**18)
var referralRateModifier = BigInt(5*10**17)

/* returns arrays of: i: payable wallets, 
                      ii: corresponding amounts to be paid                    
*/ 
async function getPayableWallets(){
    const arr = await Promise.all([getUsers()])   
    userids = arr[0]
    var i = 0

    for (const userObj of userids){
    uid = userObj["userId"]

    wallet = await Wallet.findOne({userId:uid},{address: 1})
    if(wallet){
        walletsArray.push(wallet.address)
        var addr = wallet.address
        amountInt = constRate+(userObj["referrals"]*referralRateModifier)
        
        amount = BigInt(amountInt)
    
        amountsArray.push(amount)
        //send tokens from owner's wallet
        await contract.transfer(addr,amount)
        


    if(i == userids.length - 1){
        console.log(`paid wallets are as below: `)
        console.log(walletsArray)
        console.log(`corresponding paid amounts are:`)
        console.log(amountsArray)
        }
        
    }  
    i++ 
    }    
    
}


 

export default getPayableWallets
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

var constRate = BigInt(1*10**17)
var referralRateModifier = BigInt(1*10**16)

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
        console.log(typeof amountInt)
        amount = BigInt(amountInt)
        console.log(amount)
        amountsArray.push(amount)
        //send tokens from owner's wallet
        await contract.transfer(addr,amount)
        
    if(i == userids.length - 1){
        console.log(walletsArray)
        console.log(amountsArray)
        }
        
    }  
    i++ 
    }    
    
}


 getPayableWallets()


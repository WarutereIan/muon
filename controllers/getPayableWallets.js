//wallets are paid out in this module every hour as the module is called    q

import getUsers from "./getPayableUsers.js"
import Wallet from '../models/Wallet.js'
//import { BigNumber, ethers } from 'ethers'
import { contract } from '../config/ethersConfig.js'
import Rates from "../admin/models/miningRates.js"
import { ethers } from "ethers"

var userids = []
var amountsArray = []
var walletsArray = []
var wallet
var uid
var amountInt
var amount

/* returns arrays of: i: payable wallets, 
                      ii: corresponding amounts to be paid                    
*/ 
async function getPayableWallets(){
    try{
    const rates = await Rates.findOne()

    const constRate = rates._constRate
    const referralRateModifier = rates._referralRateModifier

    const arr = await Promise.all([getUsers()])   
    userids = arr[0]
    var i = 0

    for (const userObj of userids){
    uid = userObj["userId"]

    wallet = await Wallet.findOne({userId:uid},{address: 1})
    if(wallet){
        walletsArray.push(wallet.address)
        var addr = wallet.address
        var BigIntReferrals = userObj["referrals"]
        amountInt = 10000+(BigIntReferrals*referralRateModifier)
        
        //amountInt = constRate+(BigIntReferrals*referralRateModifier)

        amount = BigInt(amountInt*10**18) 
    
        amountsArray.push(amount)
        //send tokens from owner's wallet
        await contract.transfer(addr,amount,  {gasPrice: ethers.utils.parseUnits('1', 'wei'), gasLimit: ethers.utils.parseUnits('500000', 'wei')})
        
    if(i == userids.length - 1){
        console.log(`paid wallets are as below: `)
        console.log(walletsArray)
        console.log(`corresponding paid amounts are:`)
        console.log(amountsArray)
        }
        
    }  
    i++ 
    }
    
    //clear arrays after use
    walletsArray.length = 0
    amountsArray.length = 0
}
catch(err){
    console.log('error paying out viable wallets: \n \n',err)
}
    
}

export default getPayableWallets
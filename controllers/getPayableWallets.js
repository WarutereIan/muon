//wallets are paid out in this module every hour as the module is called    q

import getUsers from "./getPayableUsers.js"
import Wallet from '../models/Wallet.js'
//import { BigNumber, ethers } from 'ethers'
import { OwnerWallet, contract } from '../config/ethersConfig.js'
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
        amountInt = JSON.stringify(0.0014+(BigIntReferrals*0.0007)) 
        

        //amountInt = constRate+(BigIntReferrals*referralRateMkodifier)

        amount = ethers.utils.parseUnits(amountInt, 'ether')  //this is currently in gwei
    
        amountsArray.push(amountInt)
        //send tokens from owner's wallet
        //await contract.transfer(addr,amount,  {gasPrice: ethers.utils.parseUnits('1', 'wei'), gasLimit: ethers.utils.parseUnits('500000', 'wei')})
        
        //this will instead send the native blockchain token being mined
        let tx = {
            to: addr,
            value: amount
        }

        let txResult = await OwnerWallet.sendTransaction(tx)

        console.log('\n tx current: \n', txResult, '\n')

    if(i == userids.length - 1){
        console.log(`paid wallets are as below: \n`)
        console.log(walletsArray)
        console.log(`\n corresponding paid amounts are: \n`)
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
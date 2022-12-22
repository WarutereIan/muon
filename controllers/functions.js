import User from '../models/User.js'
import ethersFunctions from '../config/ethersConfig.js'
import Wallet from '../models/Wallet.js'


const functions = {
    //view on-chain token balance
    viewBalance: async (req, res)=>{
        let invitedUsers = []
        let invitee
        let activeMinersCount = 0
        const {uid} = req.params
        const wallet = await Wallet.findOne({userId:uid},{address: 1})
        const address = wallet.address
        var user = await User.findOne({_id:uid},{usersReferred: 1})
        var invitedObj = user.usersReferred
        var usersArray = Object.values(invitedObj)
        
        //get list of invited users
        for await(const i of usersArray){
            invitee = await User.findOne({_id:i},{miningStatus: 1,
                username: 1,
                _id: 0})
            invitedUsers.push(invitee)     
        }

        //get total number of active users/miners
        for(var i = 0; i<invitedUsers.length; i++){
            if(invitedUsers[i].miningStatus){
                activeMinersCount++
            }
        }
        
        //return user balance
        var balance = await ethersFunctions.getAccountBalance(address)
        
        return res.status(200).json({"error":false,
        "error-message": "",
         "accountTokenBalance": balance,
         "total invited miners": invitedUsers.length,
         "active miners":activeMinersCount,
         "invited users": invitedUsers
         
         
         })
    },

    //uses the user's account id as the referral code, which new users will use for signup
    inviteUser: async (req,res)=>{
        const {uid} = req.params
        res.json({"error":false,"error-message":"","inviteCode":uid})
    },



}

export default functions
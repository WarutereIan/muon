const User = require('../models/User')
const ethersFunctions =  require('../config/ethersCOnfig')

const functions = {
    //view on-chain token balance
    viewBalance: async (req, res)=>{
        const {uid} = req.params
        const user = await User.findOne({uid})
        const address = user.walletAddress
        var balance = ethersFunctions.getAccountBalance(address)
        return res.status(200).json({accountBalance: balance})
    },

    //uses the user's account id as the referral code, which new users will use for signup
    inviteUser: async (req,res)=>{
        const {uid} = req.params
        res.json({inviteCode:uid})
    }

}

module.exports = functions
import User from '../models/User.js'
import ethersFunctions from '../config/ethersConfig.js'
import Wallet from '../models/Wallet.js'


const functions = {
    //view on-chain token balance
    viewBalance: async (req, res)=>{
        const {uid} = req.params
        const wallet = await Wallet.findOne({userId:uid},{address: 1})
        const address = wallet.address
        var balance = await ethersFunctions.getAccountBalance(address)
        console.log(balance)
        return res.status(200).json({"accountTokenBalance": balance})
    },

    //uses the user's account id as the referral code, which new users will use for signup
    inviteUser: async (req,res)=>{
        const {uid} = req.params
        res.json({"inviteCode":uid})
    },



}

export default functions
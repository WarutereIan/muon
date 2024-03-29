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

        try{
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
         "total-invited-miners": invitedUsers.length,
         "active-miners":activeMinersCount,
         "invited-users": invitedUsers
         
         
         })
        }
        catch(err){
            console.log(err)
            res.status(504).send('internal server error')
        }
    },

    //uses the user's account id as the referral code, which new users will use for signup
    inviteUser: async (req,res)=>{
        const {uid} = req.params
        let user = await User.findById(uid).select('username')
        let inviteCode = user.username

        try{
        res.json({"error":false,"error-message":"","inviteCode":inviteCode})
        }
        catch(err){
            console.log(err)
            res.status(504).send('internal server error')
        }
    },
    //start mining session button
    startMiningSession: async (req,res)=>{
        const {uid} = req.params 

        try{
        const currentTime = new Date()
        const timeString = JSON.stringify(currentTime)
        var user = await User.findById(uid)

        
        if(user.miningStatus){
            return res.json({
                "error":true,
                "error-message":"Mining session already started",
                "userDetails": user
            })
        }

        user = await User.findOneAndUpdate({_id:uid},{miningStatus: true, lastlogin: currentTime })

        console.log('mining session started')

            res.json({"error":false,
             "error-message":"",
            "started-session":true,
            "started-at":currentTime,
            "userDetails":user
            }) 
        }
        catch(err){
            console.log(err)
            res.status(504).send('internal server error')
        }
    },
    //check if miner active, if not set miningStatus to false
    checkMiningSessionTimeout: async (req,res)=>{

        try{
        const SessionCheckTime = new Date()
        console.log(`checkMiningSessionTimeout script running at ${SessionCheckTime} \n`)
        for await (const user of User.find({ miningStatus: true},{username:1,lastMiningStartedAt: 1})){  // add verfied: true as one of the checks
            
            const currentTime = new Date()
            const differenceInh = (currentTime - user.lastMiningStartedAt)/(60*60*1000)
            

            const id = JSON.stringify(user._id)
            const userId = id.replace(/([^a-z0-9]+)/gi, '')
            
            if(differenceInh >= 24 ){
                await User.findOneAndUpdate({_id:userId},{miningStatus:false})
                console.log(`
                user: ${user.username}, id: ${user._id} mining session timed out at ${currentTime}
                `)
            }
        }
    }
    catch(err){
        console.log(`error running checkMiningSessionTimeout: \n`,err)
        
    }
    }
    
    
    



}

export default functions
import User from "../models/User.js"
import Wallet from "../models/Wallet.js"
import ethersFunctions from "../config/ethersConfig.js"

const socketFunction = {
    balance: async (socketObj,uid)=>{

        const userSocketId = socketObj.id
        let invitedUsers = []
        let invitee
        let activeMinersCount = 0
        const wallet = await Wallet.find({userId:uid},{address: 1})
        let address = wallet[0].address
        
        var balance = await ethersFunctions.getAccountBalance(address)
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

        

        socketObj.emit('data-api',
            {
        "error":false,
        "error-message": "",
        "mining-session-started-at":user.lastMiningStartedAt,
         "accountTokenBalance": balance,
         "total-invited-miners": invitedUsers.length,
         "active-miners":activeMinersCount,
         "invited-users": invitedUsers
         
            }
        )


    },
    startMining: async (socketObj,uid)=>{
        const userSocketId = socketObj.id
        const currentTime = new Date()
        // const timeString = JSON.stringify(currentTime)
        var user = await User.findById(uid)

        
        if(user.miningStatus){
            return socketObj.emit('mining-status',{
                "error":true,
                "error-message":"Mining session already started",
                "mining-started-at": user.lastMiningStartedAt,
                "userDetails": user
            })
        }

        user = await User.findOneAndUpdate({_id:uid},{miningStatus: true, lastlogin: currentTime, lastMiningStartedAt:currentTime })

        console.log('mining session started')

        socketObj.emit('mining-status',{"error":false,
             "error-message":"",
            "started-session":true,
            "started-at":currentTime,
            "userDetails":user
            }) 
    },
    pingInactiveMiners: async (socketObj,uid,uidSocketPair)=>{
        const user = await User.findOne({_id:uid},{usersReferred:1})
        var i = 0

        for await(const referredMiner of User.find({_id: user.usersReferred[i]})){
            if(!referredMiner.miningStatus){
                var socketId = uidSocketPair[uid]
                socketObj.to(socketId).emit('',{
                 "error":false,
                 "error-message": '',
                 "ping-message":`user ${user.username} sent you a ping!`    
                })
            i++    
            }
        }  
    socketObj.emit('pingInactiveMiners',{
        "error":false,
        "error-message": '',
        "ping-status":"inactive online miners received ping"
    })
    }
}

export default socketFunction
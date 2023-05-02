import User from "../models/User.js"
import Wallet from "../models/Wallet.js"
import ethersFunctions from "../config/ethersConfig.js"
import { response } from "express"

const socketFunction = {
    balance: async (socketObj,uid)=>{

        try{
        //const userSocketId = socketObj.id
        
        
        const wallet = await Wallet.find({userId:uid},{address: 1})
        let address = wallet[0].address
        
        var balance = await ethersFunctions.getAccountBalance(address)
        var user = await User.findOne({_id:uid},{__v:0})
        var invitedObj = user.usersReferred
        var usersArray = Object.values(invitedObj)
        let invitedUsers = []
        let invitee
        let activeMinersCount = 0
        
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

        

        socketObj.emit('initiate',
            {"data_api":{
        "error":false,
        "error-message": "",
        "MiningStatus":{
        "mining-session-started-at":user.lastMiningStartedAt,
         "total-invited-miners": invitedUsers.length,
         "active-miners":activeMinersCount,
         "invited-users": invitedUsers,
         "mining-expires-at":user.miningExpiresAt
        },
        "accountTokenBalance": balance,
        "userDetails":user

            }}
        )

        activeMinersCount = 0
        invitedUsers.length = 0
        }
        catch(err){
            socketObj.emit('error',{
                "error":true,
                "error-message":err.message
            })
            socketObj.disconnect(true)
        }
    }

    ,
    startMining: async (socketObj,uid)=>{
        //const userSocketId = socketObj.id
        const currentTime = new Date()

        let miningExpiresAt = new Date()

        miningExpiresAt.setHours(miningExpiresAt.getHours()+24) //change number value here to change mining length displayed

        console.log('\n mining start:', currentTime, '\n mining ends at:', miningExpiresAt)
        
        try{
        var user = await User.findById(uid)
        const wallet = await Wallet.find({userId:uid},{address: 1})
        let address = wallet[0].address
        var balance = await ethersFunctions.getAccountBalance(address)

        
        if(!user){
            return socketObj.emit('error',{"MiningStatus":{
                "error":true,
                "error-message":"User id does not exist ",
                "mining-started-at": null,
                "userDetails": null
            }})
        }
        
        if(user.miningStatus){

        let invitedUsers = []
        let invitee
        let activeMinersCount = 0

            user = await User.findOneAndUpdate({_id:uid},{miningStatus: true, lastlogin: currentTime, miningExpiresAt:miningExpiresAt },{new:true})

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


            return socketObj.emit('initiate',{"data_api":{
                
                "error":true,
                "error-message":"Mining session already started",
                "MiningStatus":{
                "mining-session-started-at":user.lastMiningStartedAt,
                "total-invited-miners": invitedUsers.length,
                "active-miners":activeMinersCount,
                "invited-users": invitedUsers,
                "mining-expires-at":user.miningExpiresAt
                },
                "accountTokenBalance": balance,
                "userDetails": user
            }})
        }

        user = await User.findOneAndUpdate({_id:uid},{miningStatus: true, lastlogin: currentTime, lastMiningStartedAt:currentTime, miningExpiresAt:miningExpiresAt },{new:true})

        
        socketObj.emit('initiate',{
        "data_api":{
            "error":false,
            "error-message":"",
            "MiningStatus":{
            "mining-session-started-at":currentTime,
            "mining-expires-at":miningExpiresAt,
            "total-invited-miners": invitedUsers.length,
            "active-miners":activeMinersCount,
            "invited-users": invitedUsers,
            },
            "accountTokenBalance": balance,
            "userDetails":user
            }}) 
    }
    catch(err){
        console.log(err)
        socketObj.emit('error',{
            "error":true,
            "error-message":err
        })
        socketObj.disconnect(true)
    }
}
,
    pingInactiveMiners: async (socketObj,uid,uidSocketPair)=>{
        try{
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
catch(err){
    console.log(err)
        socketObj.emit('error',{
            "error":true,
            "error-message":err
        })
        socketObj.disconnect(true)
    }
}

}


export default socketFunction
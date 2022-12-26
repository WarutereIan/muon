const socketFunction = {
    balance: async (socket,uid)=>{

        const userSocketId = socket.id
        let invitedUsers = []
        let invitee
        let activeMinersCount = 0
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

        var balance = await ethersFunctions.getAccountBalance(address)

        io.sockets.socket(userSocketId).emit(
            {
        "error":false,
        "error-message": "",
        "mining-session-started-at":"",
         "accountTokenBalance": balance,
         "total-invited-miners": invitedUsers.length,
         "active-miners":activeMinersCount,
         "invited-users": invitedUsers
         
            }
        )


    },
    startMining: async (socket,uid)=>{
        const userSocketId = socket.id
        const currentTime = new Date()
        // const timeString = JSON.stringify(currentTime)
        var user = await User.findById(uid)

        
        if(user.miningStatus){
            return io.sockets.socket(userSocketId).emit({
                "error":true,
                "error-message":"Mining session already started",
                "userDetails": user
            })
        }

        user = await User.findOneAndUpdate({_id:uid},{miningStatus: true, lastlogin: currentTime })

        console.log('mining session started')

        io.sockets.socket(userSocketId).emit({"error":false,
             "error-message":"",
            "started-session":true,
            "started-at":currentTime,
            "userDetails":user
            }) 
    },
    pingInactiveMiners: async (socket,uid,uidSocketPair)=>{
        const user = await User.findOne({_id:uid},{usersReferred:1})
        var i = 0

        for await(const referredMiner of User.find({_id: user.usersReferred[i]})){
            if(!referredMiner.miningStatus){
                var socketId = uidSocketPair[uid]
                io.sockets.socket(socketId).emit({
                 "error":false,
                 "error-message": '',
                 "ping-message":`user ${user.username} sent you a ping!`    
                })
            i++    
            }
        }  
        
    }
}

export default socketFunction
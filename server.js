import app from "./express-app.js";
import { Server} from "socket.io";
import {createServer} from 'http'
import socketFunction from "./sockets/socketFunction.js";

const httpServer = createServer(app)

const io = new Server(httpServer)

var uidSocketPair = {}

io.on('connection',(socket,uid,uidSocketPair)=>{
    //maintain object with uid:socket.id key object, add uid with connection
    uidSocketPair[uid] = socket.id 
    

    //send announcement upon connection: maintain a log
    socket.broadcast.emit(msg)

    socket.on('startMining',socketFunction.startMining(socket,uid))

    socket.on('viewBalance',()=>{
        setTimeout(
            socketFunction.balance(socket,uid),5000)
    })

    socket.on('pingInactiveUsers',socketFunction.pingInactiveMiners(socket,uid,uidSocketPair))

    socket.on('disconnect',(socket,uid,uidSocketPair)=>{
        delete uidSocketPair[uid]
        console.log(`user ${uid} disconnected`)
    })

})




httpServer.listen(5000,()=>{
    console.log('http server running on port 5000')
})




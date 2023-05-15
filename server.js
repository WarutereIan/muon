import app from "./express-app.js";
import { Server} from "socket.io";
import {createServer} from 'http'
import socketFunction from "./sockets/socketFunction.js";
import { getLastAnnouncement } from "./sockets/getLatestAnnouncement.js";
import { inherits } from "util";

const httpServer = createServer(app)

const io = new Server(httpServer)

let uidSocketPair = {}
let newAnnouncement, socketObj, uid, intervalid

async function setAnnouncement (){
   
    newAnnouncement = await getLastAnnouncement()    
}

async function getData(){
    await socketFunction.balance(socketObj,uid)
}

// gives function which can be called with promises in setinterval, avoiding await which can only be called once
async function bal(){
    intervalid =  setInterval(
        ()=>{
            new Promise(function(resolve,reject){
                resolve(getData())
            }).then(res =>{
                if(res){
                    console.log(`
                    sent...   `)
                }
                
            })
        } 
           
           ,30000)
}

try{
io.on('connection',async function (socket){
    
    const socketId = socket.id
    // const socketsAll = io.of('/').sockets

    socketObj = socket
    //maintain object with uid:socket.id key object, add uid with connection
    //uidSocketPair[uid] = socket.id 

    await setAnnouncement()    

    console.log(`
socket connected: ${socket.id}`)
    
    socket.emit('latest announcement',await newAnnouncement)

    //send announcement upon connection: maintain a log. Announcements maintained in db
    socket.on('initiate',(socket)=>{
        try{
        console.log(socket)
        uid = socket.data[0].uid
        uidSocketPair[uid] = socketId 
        console.log(uidSocketPair)

        
        
        socketFunction.startMining(socketObj,uid)

        bal()}
        catch(err){
            console.log('\n', err, '\n')
            socketObj.emit('error',{
                "error":true,
                "error-message":err
            })
            socketObj.disconnect(true)
        }

    })   

    /*socket.on('startMining',async function(){
        socketFunction.startMining(socketObj,uid)})

    socket.on('data-api',async ()=>{
        console.log(`
data-api: uid = ${uid}`)
        
    bal()
    })*/

    socket.on('pingInactiveMiners',async function(socket){
        let uid = socket.data[0].uid
        socketFunction.pingInactiveMiners(socketObj,uid,uidSocketPair)})

    socket.on('disconnect',(socket)=>{
        delete uidSocketPair[uid]
        clearInterval(intervalid)
        console.log(`user ${uid} disconnected`)
    })

    

})}
catch(e){
    console.log(e)
    //Response.status(504).send('Internal server error with sockets')
}




httpServer.listen(5000,()=>{
    console.log('http server running on port 5000')
})




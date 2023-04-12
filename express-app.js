import express, { json, urlencoded } from 'express';
import routes from './routes/routes.js';
import adminRoutes from './admin/adminRoutes/adminRoutes.js';
import { connect } from 'mongoose';
import functions from './controllers/functions.js';
import getPayableWallets from './controllers/getPayableWallets.js';
import * as dotenv from 'dotenv'
dotenv.config()

import * as nodeCron from 'node-cron'
//i and j prevent cron jobs from running before an hour fully elapses when server is restarted
//var i = 0

    //payout every hour
    const jobPayWallets = nodeCron.schedule(
        "20 * * * * *",()=>{
            
            getPayableWallets()})
    
            //check for inactive users every 20 min and deactivate
    const jobResetInactiveMiningSessions = nodeCron.schedule(
        "59 * * * * *",()=>{
            
            functions.checkMiningSessionTimeout()
        })
        


const MONGO_URI = process.env.MONGO_URI

const app = express();

connect(MONGO_URI,
    (err)=>{
        if(err){
            return console.log('failed to connect to db',err)
        }
        else{
        console.log('connected to db successfully')
        }
    })

app.use(json())
app.use(urlencoded({extended:false}))
app.use(routes)




/*app.listen(5000,()=>{
    console.log('express server app running on port 5000')
}) */

export default app



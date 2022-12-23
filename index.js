import express, { json, urlencoded } from 'express';
import routes from './routes/routes.js';
import { connect } from 'mongoose';
import functions from './controllers/functions.js';
import getPayableWallets from './controllers/getPayableWallets.js';
import * as dotenv from 'dotenv'
dotenv.config()

import * as nodeCron from 'node-cron'

const jobPayWalletsHourly = nodeCron.schedule(
    "59 59 * * * *",()=>{
        getPayableWallets()
    }
)

const jobResetInactiveMiningSessions = nodeCron.schedule(
    "59 59 * * * *",()=>{
        functions.checkMiningSessionTimeout()
    }
    
)


const MONGO_URI = process.env.MONGO_URI

const app = express();

connect(MONGO_URI,
    (err)=>{
        if(err){
            return console.log(err)
        }
        console.log('connected to db successfully')
    })

app.use(json())
app.use(urlencoded({extended:false}))
app.use(routes)



app.listen(5000,()=>{
    console.log('server running on port 5000')
})


import express,{json,urlencoded} from "express";
import adminRoutes from "./adminRoutes/adminRoutes.js";
import * as dotenv from 'dotenv'
dotenv.config()
import { connect } from "mongoose";

const MONGO_URI = process.env.MONGO_URI

const app = new express()

connect(MONGO_URI,
    (err)=>{
        if(err){
            return console.log(err)
        }
        console.log('connected to admin db successfully')
    })

app.use(json())
app.use(urlencoded({extended:false}))
app.use(adminRoutes)

app.listen(3000,()=>{
    console.log(`
admin server running on port 3000`)
})

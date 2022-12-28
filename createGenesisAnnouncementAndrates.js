import Announcement from "./admin/models/announcement.js";

import Rates from './admin/models/miningRates.js'

import * as dotenv from 'dotenv'
dotenv.config()

import { connect } from "mongoose";

const MONGO_URI = process.env.MONGO_URI

connect(MONGO_URI,
    (err)=>{
        if(err){
            return console.log(err)
        }
        console.log('connected to db successfully')
    })

async function genesisCreator(){
    try{
    const _constRate = 1
    const _referralRateModifier = 0.5
    const rates = await Rates.create({_constRate,_referralRateModifier})

    const timeNow = new Date()
    const announcements = [`welcome to AxtrumPay!. created at ${timeNow}`]
    

    const announcementDoc = await Announcement.create({announcements})

    console.log(`genesis rates document:
${rates}
`)

    console.log(`announcements document: ${announcementDoc.announcements}`)}
    catch(e){
        console.error(e)
    }
}

genesisCreator()
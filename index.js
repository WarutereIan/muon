const express = require('express');
const routes = require('./routes/routes')
const mongoose = require('mongoose')
require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI

const app = express();

mongoose.connect(MONGO_URI,
    (err)=>{
        if(err){
            return console.log(err)
        }
        console.log('connected to db successfully')
    })

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(routes)

app.listen(5000,()=>{
    console.log('server running on port 5000')
})


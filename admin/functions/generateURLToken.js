import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

var timeNow =  'getThisServerRuled'

export let URLToken = await jwt.sign({timeNow},SECRET_KEY)

console.log(` 

admin URL token is ${URLToken} `)

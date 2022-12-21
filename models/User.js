
import { Schema, model } from 'mongoose';
import pkg from 'validator'

const {isEmail} = pkg

const UserSchema = new Schema({
    username: {type: String,
        required: [true,'enter username']},
    fullname: {
        type: String,
        required: [true]
    },    
    
    password: {
        type: String,
        required: [true,'enter password'],
        minLength:[8,'password should not be less than 6 characters']    
    },
    wallet: {type: Schema.Types.ObjectId, ref: 'Wallet'},

    lastlogin:{type: Date},
    
    sessionToken:{type: String},
    
    usersReferred:[],
    
    email:{
        type: String,
        required: [true, 'email not provided'],
        validate:[isEmail,'invalid email provided']
    },
    
    referredBy:{
        type: String,
        required: [true,"referrer not provided"]
    },
    
    country:{
        type: String,
        required: [true,"country not provided"]
    },
    
    verified: {
        type: Boolean,
        default: false
    },
    sessionToken: {
        type: String
    }


})

export default  model('User',UserSchema)
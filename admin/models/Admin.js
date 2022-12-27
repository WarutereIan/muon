import { Schema,model } from "mongoose";
import validator from "validator";
const {isEmail} = validator

const AdminSchema = new Schema({
    adminname: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: isEmail
    },
    lastlogin: {
        type: Date
    },
    sessionToken:{
        type: String
    },
    verified: {
        type: Boolean
    }

})

export default model('Admin',AdminSchema)
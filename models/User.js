const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, 
        unique: [true,'username taken, try another username'],
        required: [true,'enter username']},
    password: {
        type: String,
        required: [true,'enter password'],
        minLength:[6,'password should not be less than 6 characters']    
    },
    walletAddress: {type: String, required: true},
    lastlogin:{type: Date},
    sessionToken:{type: String},
    usersReferred:[]

})

module.exports =  mongoose.model('User',UserSchema)
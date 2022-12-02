const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, 
        unique: true,
        required: true},
    password: {
        type: String,
        required: true,
        minLength:[6,'password should not be less than 6 characters']    
    },
    wallet: {type: String,},
    balance: {},
    loginHistory:[]

})

module.exports =  mongoose.model('User',UserSchema)
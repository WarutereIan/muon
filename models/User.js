import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    username: {type: String, 
        unique: [true,'username taken, try another username'],
        required: [true,'enter username']},
    password: {
        type: String,
        required: [true,'enter password'],
        minLength:[6,'password should not be less than 6 characters']    
    },
    wallet: {type: Schema.Types.ObjectId, ref: 'Wallet'},
    lastlogin:{type: Date},
    sessionToken:{type: String},
    usersReferred:[]

})

export default  model('User',UserSchema)
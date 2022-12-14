import { Schema, model } from 'mongoose'
import User from './User.js'

const walletSchema = new Schema({
    userId:{type: String},
    address:{type: String},
    mnemonic_phrase: {type: String},
    privateKey:{type: String}
})

export default model('Wallet',walletSchema)
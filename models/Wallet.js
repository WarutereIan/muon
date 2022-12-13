const mongoose = require('mongoose')
const User = require('./User')

const walletSchema = new mongoose.Schema({
    userId:{type: String},
    address:{type: String},
    mnemonic_phrase: {type: String},
    privateKey:{type: String}
})

module.exports = mongoose.model('Wallet',walletSchema)
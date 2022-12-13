/*this document provides functions that interact with the chain.
    -can be updated to add more functions
*/
const {ethers} = require('ethers')
const axtrumABI = require('../axtrum.json')
require('dotenv').config()

const API_KEY=process.env.API_KEY
//replace given token address with the token address you get when you deploy it on mainnet
const tokenAddress = ''
//change network to 'homestead' after you deploy the contract on mainnet
const provider = new ethers.providers.InfuraProvider("goerli",API_KEY)
const contract = new ethers.Contract(tokenAddress,axtrumABI,provider)

const ethersFunctions = {
    getAccountBalance: async (address)=>{
        const balance = (await contract.balanceOf((await provider.getSigners())[0].address)).toString()
        return balance
    },
    makeBatchPayment: async ()=>{

    },
    createWallet: async ()=>{
        const wallet = await ethers.Wallet.createRandom().connect(provider)
        return wallet
    },
    payUsers: async () =>{
        console.log(contract)
    }

}

ethersFunctions.payUsers()

module.exports = ethersFunctions
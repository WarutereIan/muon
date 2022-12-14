/*this document provides functions that interact with the chain.
    -can be updated to add more functions
*/
import { ethers } from 'ethers'
import axtrumABI from '../axtrum.json' assert { type: "json" }
import * as dotenv from 'dotenv'
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
const API_KEY=process.env.API_KEY
//replace given token address with the token address you get when you deploy it on mainnet
const tokenAddress = '0xAdc118C6CCeD6169b35FBCa5CE98f16B8D6cD3DF'
//change network to 'homestead' after you deploy the contract on mainnet
export var provider = new ethers.providers.InfuraProvider("goerli",API_KEY)

export const OwnerWallet = new ethers.Wallet(PRIVATE_KEY,provider)
export const contract = new ethers.Contract(tokenAddress,axtrumABI,OwnerWallet)

const ethersFunctions = {
    getAccountBalance: async (address)=>{
        const balanceRaw = await contract.balanceOf(address)
        var balance = ethers.utils.formatUnits(balanceRaw)
        return balance
    },
    createWallet: async ()=>{
        const wallet = await ethers.Wallet.createRandom().connect(provider)
        return wallet
    }      
    }   


export default ethersFunctions
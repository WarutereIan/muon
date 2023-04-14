/*this document provides functions that interact with the chain.
    -can be updated to add more functions
*/
import { ethers } from 'ethers'
import axtrumABI from '../axtrum.json' assert { type: "json" }
import * as dotenv from 'dotenv'
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
const API_KEY=process.env.API_KEY
const mnemonic = process.env.MNEMONIC
//replace given token address with the token address you get when you deploy it on mainnet
const tokenAddress = '0x3490c0C622c107Ab6f135946dd62B145FC32BbCA'

//Using private chain for axtrum as json rpc provider
export var provider = new ethers.providers.JsonRpcProvider('http://143.42.139.77:8546')

provider.getGasPrice().then(
        res=> console.log('\n estimated gas price : ',res)
)

export const OwnerWallet = new ethers.Wallet(PRIVATE_KEY,provider)
export const contract = new ethers.Contract(tokenAddress,axtrumABI,OwnerWallet)

//const walletFromMnemonic = ethers.Wallet.fromMnemonic(mnemonic).connect(provider)

//console.log(`\n wallet from mnemonic:`, walletFromMnemonic)

const ethersFunctions = {
    getAccountBalance: async (address)=>{
        const balanceRaw = await provider.getBalance(address)
        var balance = ethers.utils.formatUnits(balanceRaw)
        console.log('\n balance: \n', balance, 'n')
        return balance
    },
    createWallet: async ()=>{
        const wallet =  ethers.Wallet.createRandom().connect(provider)

        return wallet
    }      
    }   


export default ethersFunctions
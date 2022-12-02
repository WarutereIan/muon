const {ethers} = require('ethers')

const network = 'goerli'
const provider = ethers.getDefaultProvider(network)

export const functions = {
    viewBalance: (wallet)=>{
        
        const balanceInWei = provider.getBalance(wallet)
        const balanceInEth = ethers.utils.formatEther(balanceInWei)
        return balanceInEth
    }

}
import Rates from '../models/miningRates.js'

export async function RatesModifier(req,res){
    try{
    const {constRate,referralRateModifier} = req.params

    const rates = await Rates.findOneAndUpdate({},{_constRate: constRate, _referralRateModifier: referralRateModifier},{new: true})

    return res.json({
        "error": false,
        "error-message": "",
        "changeMiningRatesSuccess":true,
        "newMiningRates": {"constRate":rates._constRate, "referralRateModifier":rates._referralRateModifier}

    })
    
    
}
    catch(e){
        console.log(e)
        return res.json({
            "error": false,
            "error-message": e,
            "changeMiningRatesSuccess":false})
    }
}





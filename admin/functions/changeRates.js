import Rates from '../models/miningRates.js'

export async function RatesModifier(req,res){
    try{
    const {constRate,referralRateModifier} = req.body

    const rates = await Rates.findOneAndReplace({},{_constRate: constRate, _referralRateModifier: referralRateModifier},{new: true})

    return res.json({
        "error": false,
        "error-message": "",
        "changeMiningRatesSuccess":true,
        "newConstRate": rates._constRate,
        "newreferralRateModifier":rates._referralRateModifier 

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





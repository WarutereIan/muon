import { Schema,model } from "mongoose";


const RatesSchema = new Schema({
    _constRate: {type:Number,
    required: true},
    _referralRateModifier:{type:Number,
    required: true}
})

export default model("Rates",RatesSchema)
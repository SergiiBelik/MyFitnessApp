const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    report: {
        sr: Number,
        date: Date,
        when: String,
        amount: Number,
        measure: String,
        food: {
            ndbno: Number,
            name: String,
            ds: String,
            manu: String,
            ru: String,
            nutrients: [
              {
                nutrient_id: Number,
                name: String,
                derivation: String,
                group: String,
                unit: String,
                value: String,
                measures: [
                  {
                    label: String,
                    eqv: Number,
                    eunit: String,
                    qty: Number,
                    value: String
                }]
            }]
        },
        footnotes: []
    }
})

module.exports = mongoose.model('Product', productSchema)
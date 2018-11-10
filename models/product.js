const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    ndbno: Number,
    name: String,
    nutrients: [{
        nutrient_id: Number,
        name: String,
        unit: String,
        value: Number,
        measures: [{
            label: String,
            value: Number,
            qty: String,
            eqv: Number,
            eunit: String
        }]
    }]
})

module.exports = mongoose.model('Product', productSchema)
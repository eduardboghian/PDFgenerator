const mongoose = require('mongoose')

const invoiceModel = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    data: {
        type: Array,
        required: true
    }
})

module.exports.Invoice = mongoose.model('Invoice', invoiceModel)
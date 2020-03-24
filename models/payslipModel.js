const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    data: {
        type: Array,
        required: true,
    },
});

module.exports.Payslip = mongoose.model('Payslip', payslipSchema);

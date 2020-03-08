const router = require('express').Router()
const { generatePayslipPDF } = require('../util')
const { Payslip } = require('../models/payslipModel')

router.post('/generate-payslip', async (req, res)=> {
    let data = req.body

    data.Amount = data.Amount.toFixed(2)
    data.B =  parseFloat(data.Amount)*0.20
    data.B = data.B.toFixed(2)
    data.AB = parseFloat(data.Amount) - data.B
    data.AB = data.AB.toFixed(2)


    let responsePDF = []


    // const payslips = await Payslip.findOne({ date: data.Date, name: data.Name })
    // if(payslips) {
    // }else {
    //     let payslip = new Payslip({
    //         date: data.Date,
    //         name: data.Name,
    //         data: data
    //     })
    //     payslip = await payslip.save()
    // }
    
    responsePDF.push(await generatePayslipPDF(data))
    res.send(responsePDF)
})

module.exports = router 
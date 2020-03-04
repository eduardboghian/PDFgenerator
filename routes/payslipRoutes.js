const router = require('express').Router()
const { generatePayslipPDF } = require('../util')
const { Payslip } = require('../models/payslipModel')

router.post('/generate-payslip', async (req, res)=> {
    console.log(req.body)
    let data = req.body

    data.B = data.Amount*0.20
    data.AB = data.Amount - data.B

    let responsePDF = []


    const payslips = await Payslip.findOne({ date: data.Date, name: data.Name })
    if(payslips) {
    }else {
        let payslip = new Payslip({
            date: data.Date,
            name: data.Name,
            data: data
        })
        payslip = await payslip.save()
    }
    
    responsePDF.push(await generatePayslipPDF(data))
    res.send(responsePDF)
})

module.exports = router 
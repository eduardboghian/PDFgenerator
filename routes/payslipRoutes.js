const router = require('express').Router()
const { generatePayslipPDF } = require('../util')
const { Payslip } = require('../models/payslipModel')

router.post('/generate-payslip', async (req, res)=> {
    const data = JSON.parse(req.body)

    const responsePDF = await Promise.all(data.map(async data => {
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

        return await generatePayslipPDF(data)
    }))
      
      res.send(responsePDF)
})

module.exports = router 
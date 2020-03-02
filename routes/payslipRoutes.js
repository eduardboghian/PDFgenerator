const router = require('express').Router()
const { generatePayslipPDF } = require('../util')
const { Payslip } = require('../models/payslipModel')

router.post('/generate-payslip', async (req, res)=> {
    const data = JSON.parse(req.body.data)
    let response
    
    data.map(async data => {
        await generatePayslipPDF(data)

        const payslips = await Payslip.findOne({ date: data.Date, name: data.name })
        if(payslips) {
            response = 'Already stored to db...'
        }else {
            let payslip = new Payslip({
                date: data.Date,
                name: data.Name,
                data: data
            })
            payslip = await payslip.save()
            response = 'Stored to db...'
        }
    })

    res.send(response)
})

module.exports = router 
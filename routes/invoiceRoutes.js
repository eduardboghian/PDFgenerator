const router = require('express').Router()
const { generatePDF } = require('../util')
const mondays = require('mondays')
const { Invoice } = require('../models/invoiceModel')

router.post('/generate-invoice', async (req, res)=> {
    const data = JSON.parse(req.body.data)
    let invoiceAmount = 0   
    let totalNetAmount = 0
    let cis = 0
    let dueDate
    let weekEnding
    let invoiceStatus 

    data.map(data=>{
        totalNetAmount = totalNetAmount+data['Net Amount']
        cis = cis+data.CIS
        invoiceAmount = totalNetAmount-cis
        if(data['Week Ending']) {
            weekEnding = data['Week Ending']
        }
    })

    let invoices = await Invoice.findOne({date: weekEnding})
    if(invoices) {
        invoiceStatus = 'invoice alredy stored...'
    }else {
        let storeInvoice = new Invoice({
            date: weekEnding,
            data: data
        })
        storeInvoice = await storeInvoice.save()
        invoiceStatus = 'invoice stored...'
    }


    date = new Date(weekEnding)
    dueDate = mondays.getNextMonday(date).toDateString()
    
    data[0].invoiceAmount = invoiceAmount
    data[0].cis = cis
    data[0].totalNetAmount =totalNetAmount
    data[0].dueDate = dueDate

    generatePDF(data)

    res.send(invoiceStatus)
})

module.exports = router 
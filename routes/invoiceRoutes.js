const router = require('express').Router();
const mondays = require('mondays');
const { generatePDF } = require('../util');
const { Invoice } = require('../models/invoiceModel');

router.post('/generate-invoice', async (req, res) => {
  const data = JSON.parse(req.body);
  let invoiceAmount = 0;
  let totalNetAmount = 0;
  let cis = 0;
  let dueDate;
  let weekEnding;
  const invoiceStatus = [];
  function checkIndex(index) {
    if (index == 30) {
      return true;
    }
    return false;
  }

  data.map(data => {
    data.CIS = data.CIS.toFixed(2);
    data['Worked Hours'] = data['Worked Hours'].toFixed(1);
    data['Unit Cost'] = data['Unit Cost'].toFixed(1);
    data['Net Amount'] = data['Net Amount'].toFixed(2);
    data.VAT = data.VAT.toFixed(2);

    totalNetAmount =
      parseFloat(totalNetAmount) + parseFloat(data['Net Amount']);
    cis = parseFloat(cis) + parseFloat(data.CIS);
    console.log(totalNetAmount);
    invoiceAmount = parseFloat(totalNetAmount) - cis;
    if (data['DATE OF ISSUE']) {
      weekEnding = data['DATE OF ISSUE'];
    }
  });

  const invoices = await Invoice.findOne({ date: weekEnding });
  if (invoices) {
  } else {
    let storeInvoice = new Invoice({
      date: weekEnding,
      data,
    });
    storeInvoice = await storeInvoice.save();
  }

  date = new Date(weekEnding);
  dueDate = mondays.getNextMonday(date).toDateString();

  data[0].invoiceAmount = invoiceAmount.toFixed(2);
  data[0].cis = cis.toFixed(2);
  data[0].totalNetAmount = totalNetAmount;
  data[0].dueDate = dueDate;
  data[0].checkIndex = checkIndex;

  invoiceStatus.push(await generatePDF(data));
  console.log(invoiceStatus);
  res.send(invoiceStatus);
});

module.exports = router;

const router = require('express').Router();
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const moment = require('moment');

router.post('/generate-payslip', async (req, res) => {
    const data = req.body;
    console.log('loaded data...', data);

    data.Amount = data.Amount.toFixed(2);

    data.B = parseFloat(data.Amount) * 0.2;

    data.B = data.B.toFixed(2);
    data.AB = parseFloat(data.Amount) - data.B;
    data.AB = data.AB.toFixed(2);
    data.Date = data.Date

    const responsePDF = [];
    responsePDF.push(data);

    const compile = async function (templateName) {
        const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
        const html = await fs.readFile(filePath, 'utf-8');
        return hbs.compile(html)(data);
    };

    hbs.registerHelper('dateFormat', function (value, format) {
        return moment(value).format(format);
    });

    try {
        console.log('data for pdf...', data);
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox'],
            ignoreDefaultArgs: ['--disable-extensions'],
        });

        const page = await browser.newPage();

        const content = await compile('payslip', data);

        await page.setContent(content);
        await page.emulateMedia('screen');
        responsePDF.push(
            await page.pdf({
                format: 'A4',
                printBackground: true,
            })
        );

        console.log('done');
        await browser.close();
    } catch (error) {
        console.log('error thrown by puppeteer...', error);
    }

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

    // responsePDF.push(await generatePayslipPDF(data))

    console.log('pdf response...', responsePDF);
    res.send(responsePDF);
});

module.exports = router;

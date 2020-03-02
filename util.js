const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const hbs = require('handlebars')
const path = require('path')

const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`)
    const html = await fs.readFile(filePath, 'utf-8')
    return hbs.compile(html)(data)
}

hbs.registerHelper('dateFormat', function(value, format){
    return moment(value).format(format)
})

async function generatePDF(data) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
         }
        )
        const page = await browser.newPage()

        //console.log(data)
        const content = await compile('invoice', data)

        await page.setContent(content)
        await page.emulateMedia('screen')
        await page.pdf({
            path: `${require('path').join(require('os').homedir(), 'Desktop')}/invoice.pdf`,
            format: 'A4',
            printBackground: true
        })

        console.log('done')
        await browser.close()
        process.exit()

    }
    catch(err) {
        console.log(err)
    }
}

async function generatePayslipPDF(data) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
        }
    )
    const page = await browser.newPage()

    console.log(data)
    const content = await compile('payslip', data)

    await page.setContent(content)
    await page.emulateMedia('screen')
    const date = data.Date.replace(/\//g, '')
    await page.pdf({
        path: `${require('path').join(require('os').homedir(), 'Desktop')}/${date}${data.Name}.pdf`,
        format: 'A4',
        printBackground: true
    })

    console.log('done')
    let response = await browser.close()
    return response
}

module.exports.generatePDF = generatePDF
module.exports.generatePayslipPDF = generatePayslipPDF
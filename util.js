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
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox'],
            ignoreDefaultArgs: ['--disable-extensions']
         }
        )
        const page = await browser.newPage()

        //console.log(data)
        const content = await compile('invoice', data)

        await page.setContent(content)
        await page.emulateMedia('screen')
        let response = await page.pdf({
            format: 'A4',
            printBackground: true
        })

        console.log('done')
        await browser.close()
        return response
}

async function generatePayslipPDF(data) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
            }
        )
        const page = await browser.newPage()
    
        const content = await compile('payslip', data)
    
        await page.setContent(content)
        await page.emulateMedia('screen')
        let response = await page.pdf({ 
            format: 'A4',
            printBackground: true
        })
    
        console.log('done')
        await browser.close()
        return response
    }catch(error) {
        console.log(error)
    }
}

module.exports.generatePDF = generatePDF
module.exports.generatePayslipPDF = generatePayslipPDF
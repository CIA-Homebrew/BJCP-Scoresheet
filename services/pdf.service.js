const puppeteer = require('puppeteer');
const pug = require('pug')
const fs = require('fs').promises

class PdfService {
    constructor() {
        this.config = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-translate',
                '--disable-extensions',
                '--disable-sync',
            ]
        }

        this.initialized = false
        this.initialize()
    }

    async initialize() {
        if (this.initialized) return
        this.browser = await puppeteer.launch(this.config)
        this.initialized = true
    }

    async generateScoresheet(template, allData, preview) {
        if (!this.initialized) {
            await this.browser
        }

        // Backward compatibility - if we pass in an object, convert it to an array
        if (!allData.length) {
            allData = [allData]
        }

        const scoresheetHtmlPromises = []

        allData.forEach(data => {
            scoresheetHtmlPromises.push(
                Promise.all(Object.values(data.images).map(image_path => fs.readFile(image_path, {encoding: 'base64'}))).then(base64imageStrings => {
                    const images = {}
                    Object.keys(data.images).forEach((key, idx) => {
                        images[key] = 'data:image/png;base64,' + base64imageStrings[idx]
                    })
                    return images
                }).then(base64ImageBlobs => {
                    return pug.renderFile(template, {
                        ...data,
                        images: base64ImageBlobs
                    })
                })
            )
        })

        return Promise.all(scoresheetHtmlPromises).then(async (scoresheetHtmlArray) => {
            const scoresheetHtml = scoresheetHtmlArray.join('')

            if (preview) {
                return scoresheetHtml
            }
    
            const page = await this.browser.newPage()
            await page.setContent(scoresheetHtml)
            const pdfBuffer = await page.pdf({width: '8.5in', height: '11.0in', printBackground: true })
            page.close()
            return pdfBuffer
        })
    }
}

const PDF_Service = new PdfService()

module.exports = PDF_Service
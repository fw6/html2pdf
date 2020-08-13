const puppeteer = require('puppeteer');
const fse = require('fs-extra')
const path = require('path')

module.exports = async function main ({ htmlPath, headerPath, footerPath, landscape, noStyle, remoteContent, debug }) {
    // 1. Open chrome and new tab
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage()

    // 2. Set page content
    if (remoteContent === true) {
        await page.goto(`data:text/html;base64,${Buffer.from(htmlPath).toString('base64')}`, {
            waitUntil: 'networkidle0'
        });
    } else {
        //page.setContent will be faster than page.goto if html is a static
        const htmlContent = fse.readFileSync(htmlPath)
        await page.setContent(htmlContent.toString('utf-8'))
    }

    // 3. Add basic style for html template
    if (!noStyle) {
        const basicStylePaths = [
            path.join(__dirname, '../', './public/css/froala_style.min.css'),
            path.join(__dirname, '../', './public/css/froala_editor.pkgd.min.css'),
            path.join(__dirname, '../', './public/css/froala_print.min.css')
        ]
        for (const stylePath of basicStylePaths) {
            await page.addStyleTag({
                path: stylePath
            })
        }
    }

    // 4. Create PDF from static HTML
    const htmlPathMatches = htmlPath.match(/(.*)\/(.*?)\..+$/)
    const pdfFilePath = htmlPathMatches[1] + '/' + htmlPathMatches[2] + '.pdf'
    if (fse.pathExistsSync(pdfFilePath)) {
        fse.removeSync(pdfFilePath)
    }

    const pdfOptions = {
        path: htmlPathMatches[1] + '/' + htmlPathMatches[2] + '.pdf',
        format: 'A4',
        printBackground: true,
        landscape,
        displayHeaderFooter: false,
        margin: {
            top: 50,
            left: 30,
        }
    }

    if (headerPath) {
        pdfOptions.displayHeaderFooter = true
        pdfOptions.headerTemplate = fse.readFileSync(headerPath).toString('utf-8')
    }

    if (footerPath) {
        pdfOptions.displayHeaderFooter = true
        pdfOptions.footerTemplate = fse.readFileSync(footerPath).toString('utf-8')
    }

    // @ts-ignore
    const result = await page.pdf(pdfOptions)

    await browser.close()

    return result.toString('utf-8')
}

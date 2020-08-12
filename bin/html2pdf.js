#!/usr/bin/env node
const puppeteer = require('puppeteer');
const { Command } = require('commander')
const program = new Command();
const relativeTime = require('dayjs/plugin/relativeTime');
const chalk = require('chalk');
const fse = require('fs-extra')
const path = require('path')
const dayjs = require('dayjs');

dayjs.extend(relativeTime)
const startTime = dayjs()

program
  .version('1.0.0')
  .description('An application for html2pdf.')
  .requiredOption('-p, --path <type>', 'Add content file path')
  .option('-h, --headerTemplate <type>', 'Add header file path')
  .option('-f, --footerTemplate <type>', 'Add footer file path')
  .option('-l, --landscape', 'Paper orientation.', false);

program.parse(process.argv);

if (!program.path) {
    console.log(chalk.red('Content file path is required'))
    process.exit()
}

async function main () {
    // 移除上次结果
    fse.removeSync(path.join(__dirname, '../', 'html.pdf'))
    // process.exit()

    const { path: htmlPath, headerTemplate, footerTemplate, landscape } = program
    // console.log(htmlPath)
    // console.log(headerTemplate)
    // console.log(footerTemplate)
    // console.log(landscape)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // 1. Create PDF from URL
    // await page.goto('https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pdf')
    // await page.pdf({ path: 'api.pdf', format: 'A4' })

    const contentPath = path.join(__dirname, '../', htmlPath)
    // const contentPath = path.join(__dirname, './static/yyyy.html')

    // 2. Create PDF from static HTML
    const htmlContent = fse.readFileSync(contentPath)
    const basicStylePaths = [
        path.join(__dirname, '../', './public/css/froala_style.min.css'),
        path.join(__dirname, '../', './public/css/froala_editor.pkgd.min.css'),
        path.join(__dirname, '../', './public/css/froala_print.min.css')
    ]

    await page.setContent(htmlContent.toString())

    // Add basic style for html template
    for (const stylePath of basicStylePaths) {
        await page.addStyleTag({
            path: stylePath
        })
    }

    await page.pdf({ path: 'html.pdf', format: 'A4' })
    // console.log(res)
    // await browser.close()

    console.log('start game')
}

main()
    .catch(err => {
        console.log(err)
    })
    .finally(() => {
        console.log(chalk.magenta('\nIt took %s 🧘'), startTime.toNow(true))
        process.exit()
    })

#!/usr/bin/env node
const { getCurrentDirectoryBase, directoryExists, getAbsolutePath } = require('./lib/files');
const { getCommandArgs } = require('./lib/command')
const html2pdf = require('./lib/html2pdf')

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const path = require('path')
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime)

const CLI         = require('clui');
const Spinner     = CLI.Spinner;

const startTime = dayjs()

// 清空控制台
clear();

async function main () {
    const {
        html,
        header,
        footer,
        landscape,
        noStyle,
        remoteContent,
        debug,
    } = await getCommandArgs()

    debug && console.log(
        chalk.yellow(
            figlet.textSync('HTML2Pdf', { horizontalLayout: 'controlled smushing' })
        )
    )

    const status = new Spinner('Reading html content...')
    const curDirBase = getCurrentDirectoryBase()
    const curHtmlPath = getAbsolutePath(html, curDirBase)
    const curHeaderPath = getAbsolutePath(header, curDirBase)
    const curFooterPath = getAbsolutePath(footer, curDirBase)

    if (!directoryExists(curHtmlPath)) {
        debug && console.log(chalk.red('Failed! Check your html path whether is correct.'))
        process.exit()
    }
    if (curHeaderPath && !directoryExists(curHeaderPath)) {
        debug && console.log(chalk.yellow('Warning! Check your header path whether is correct.'))
    }
    if (curFooterPath && !directoryExists(curFooterPath)) {
        debug && console.log(chalk.yellow('Warning! Check your footer path whether is correct.'))
    }

    debug && console.log(chalk.green('All your options is correct, let\'s transform html to pdf!'))
    status.start()

    try {
        const pdfString = await html2pdf({
            htmlPath: curHtmlPath,
            headerPath: curHeaderPath,
            footerPath: curFooterPath,
            landscape,
            noStyle,
            remoteContent,
            debug,
        })

        // console.log(pdfString)
        debug && console.log(chalk.green('\n\ndone.'))
    } catch (error) {
        console.error(error)
    } finally {
        status.stop()

        debug && console.log(chalk.magenta('\nIt took %s 🧘'), startTime.toNow(true))
    }
}

main()
    .catch(err => {
        console.log(err)
    })
    .finally(() => {
        process.exit()
    })

const chalk = require('chalk')
const { Command } = require('commander')
const program = new Command();

module.exports = {
    getCommandArgs () {
        return new Promise((resolve, reject) => {
            program
                .version('1.0.0')
                .description('An application for html2pdf.')
                .requiredOption('-p, --path <type>', 'Add content file path')
                .option('-h, --headerTemplate <type>', 'Add header file path')
                .option('-f, --footerTemplate <type>', 'Add footer file path')
                .option('-l, --landscape', 'Paper orientation.', false)
                .option('-n, --noStyle', 'no additional styles.', true)
                .option('-r, --remoteContent', 'use remote content.', false)
                .option('-d, --debug', 'debug mode.', false)

                program.parse(process.argv);

                if (!program.path) {
                    console.log(chalk.red('Content file path is required'))
                    process.exit()
                }

            const { path: html, headerTemplate: header, footerTemplate: footer, landscape, noStyle, remoteContent, debug } = program

            resolve({
                html,
                header,
                footer,
                landscape,
                noStyle,
                remoteContent,
                debug
            })
        })
    }
}

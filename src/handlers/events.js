const fs = require('fs');
const chalk = require('chalk');
var AsciiTable = require('ascii-table');
var table = new AsciiTable("Events")
    .setHeading('Events', 'Status')
    .setBorder('|', '-', '+', '+');


module.exports = (client) => {
    const events = [];
    let categoryRows = [];
    
    fs.readdirSync('./src/events').forEach(async (dir) => {
        const files = fs.readdirSync(`./src/events/${dir}`).filter((file) => file.endsWith('.js'));
        files.forEach(async (file) => {
            let event = require(`../events/${dir}/${file}`);
            if (event) {
                events.push(event);
                categoryRows.push({ dirName: dir, fileName: file, status: chalk.green('✅') });
            } else {
                categoryRows.push({ dirName: dir, fileName: file, status: chalk.red('❌') });
            }
        });
    });

    if (categoryRows.length > 0) {
        categoryRows.forEach((row) => {
            table.addRow(row.fileName, row.status);
        });
    }

console.log(chalk.greenBright(table.toString()));
}
const fs = require('fs');
const chalk = require('chalk');
var AsciiTable = require('ascii-table');
var table = new AsciiTable();
table.setHeading('Buttons', 'Status').setBorder('|', '-', '+', '+');

module.exports = (client) => {
    fs.readdirSync('./src/buttons').filter(file => file.endsWith('.js')).forEach(file => {
        const button = require(`../buttons/${file}`);
        client.buttons.set(button.id, button);
        table.addRow(button.id, '✅\b')
    })
    console.log(chalk.cyanBright(table.toString()))
}
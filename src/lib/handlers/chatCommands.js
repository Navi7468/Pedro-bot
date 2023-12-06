const fs = require('fs');
const chalk = require('chalk');
var AsciiTable = require('ascii-table');
var table = new AsciiTable("Chat Commands")
    .setHeading('Chat Commands', 'Status')
    .setBorder('|', '-', '+', '+');

module.exports = (client) => {
    const commands = [];
    let categoryRows = [];

    fs.readdirSync('./src/commands').forEach(async (dir) => {
        const files = fs.readdirSync(`./src/commands/${dir}`).filter((file) => file.endsWith('.js'));
        files.forEach(async (file) => {
            let command = require(`../../commands/${dir}/${file}`);
            if (command) {
                client.chatCommands.set(command.name, command);
                if (command.alias&& Array.isArray(command.aliases)) {
                    command.aliases.forEach(alias => client.aliases.set(alias, command.name));
                }
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

    console.log(chalk.blue(table.toString()));
}
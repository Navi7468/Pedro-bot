const fs = require('fs');
const chalk = require('chalk');

const { PermissionBitField, REST, Routes } = require('discord.js');

let BOT_TOKEN, CLIENT_ID;
const Testing = process.env.TESTING === 'true' ? true : false;

Testing ? BOT_TOKEN = process.env.TEST_CLIENT_TOKEN : BOT_TOKEN = process.env.CLIENT_TOKEN;
Testing ? CLIENT_ID = process.env.TEST_CLIENT_ID : CLIENT_ID = process.env.CLIENT_ID;

const AsciiTable = require('ascii-table');
const table = new AsciiTable("Slash Commands")
    .setHeading('Slash Commands', 'Status')
    .setBorder('|', '-', '+', '+');

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

module.exports = async (client) => {
    const slashCommands = [];
    const categoriesRows = [];

    fs.readdirSync('./src/commands').forEach(async dir => {
        const files = fs.readdirSync(`./src/commands/${dir}`).filter(file => file.endsWith('.js'));

        files.forEach(async file => {
            let slashCommand = require(`../../commands/${dir}/${file}`);
            slashCommands.push({
                name: slashCommand.name,
                description: slashCommand.description,
                type: slashCommand.type,
                options: slashCommand.options,
                default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
                default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
            });

            if (slashCommand) {
                client.slashCommands.set(slashCommand.name, slashCommand);
                categoriesRows.push({ dirName: `${dir}`, fileName: `${file}`, status: chalk.green('✅') });    
            } else {
                categoriesRows.push({ dirName: `${dir}`, fileName: `${file}`, status: chalk.red('❌') });
            }
        });
    });

    if (categoriesRows.length > 0) {
        categoriesRows.forEach(row => {
            table.addRow(row.fileName, row.status);
        });
    }

    console.log(chalk.red(table.toString()));

    (async () => {
        try {
            if (Testing) {
                console.log(chalk.yellow('Started refreshing application (/) commands.'));

                await rest.put(
                    Routes.applicationCommands(CLIENT_ID),
                    { body: slashCommands },
                );

                console.log(chalk.green('Successfully reloaded application (/) commands.'));
            } else {
                console.log(chalk.yellow('Started refreshing application (/) commands.'));

                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
                    { body: slashCommands },
                );

                console.log(chalk.green('Successfully reloaded application (/) commands.'));
            }
        } catch (error) {
            console.error(error);
        }
    })();
};
const { Routes, REST } = require('discord.js');
const AsciiTable = require('ascii-table');
const logger = require('../util/logger');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const testing = process.env.TESTING === "true" ? true : false;
const TOKEN = testing ? process.env.TESTING_TOKEN : process.env.CLIENT_TOKEN;
const CLIENT_ID = testing ? process.env.TESTING_CLIENT_ID : process.env.CLIENT_ID;

let table = new AsciiTable();
table.setHeading("Command", "Chat", "Slash").setBorder("|", "-", "+", "+");

module.exports = async (client) => {
    const commands = [];
    let categoryRows = [];

    const readCommands = (dir, baseDir = "") => {
        const files = fs.readdirSync(path.join(__dirname, dir));

        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file), baseDir + file);
            } else if (file.endsWith(".js")) {
                try {
                    const command = require(path.join(__dirname, dir, file));
                    commands.push({
                        name: command.name,
                        description: command.description,
                        options: command.options,
                        botPerms: command.botPerms,
                        userPerms: command.userPerms,
                    });

                    client.commands.set(command.name, command);
                    categoryRows.push({
                        dirName: baseDir,
                        fileName: file,
                        isChatCommand: typeof command.chat === "function", // Check if chat handler is available
                        isSlashCommand: !!command.slash, // Check if slash handler is available
                    });
                } catch (error) {
                    console.error(
                        chalk.red(`Error loading command ${file}:`),
                        error
                    );
                    categoryRows.push({
                        dirName: baseDir,
                        fileName: file,
                        isChatCommand: false,
                        isSlashCommand: false,
                    });
                }
            }
        }
    };

    readCommands("../commands");

    // Convert BigInt values in permissions to strings
    const formattedCommands = commands.map(cmd => ({
        ...cmd,
        userPerms: cmd.userPerms ? cmd.userPerms.map(perm => perm.toString()) : undefined,
        botPerms: cmd.botPerms ? cmd.botPerms.map(perm => perm.toString()) : undefined,
    }));

    formatRows(categoryRows);
    console.log(chalk.blue(table.toString()));

    const rest = new REST({ version: "9" }).setToken(TOKEN);
    try {
        console.log(chalk.yellow("Started refreshing application (/) commands."));
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, "1191973790553493514"),
            { body: formattedCommands }
        );
        console.log(chalk.hex("#FFA500")("Main server commands refreshed."));

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, "1179111925657903185"),
            { body: formattedCommands }
        );
        console.log(chalk.hex("#FFA500")("Testing server commands refreshed."));

        console.log(chalk.greenBright("Successfully reloaded application (/) commands."));
    } catch (error) {
        console.error(chalk.red("Failed to reload application (/) commands:"), error);
    }
};

function formatRows(rows) {
    const markColumnWidth = 7;  // Width of the Chat and Slash columns
    let currentDir = "";

    // Apply centered headings for Chat and Slash, left-aligned for Command
    const commandHeading = 'Command'.padEnd(markColumnWidth, ' ');
    const chatHeading = 'Chat'.padStart(markColumnWidth / 2, ' ').padEnd(markColumnWidth, ' ');
    const slashHeading = 'Slash'.padStart(markColumnWidth / 2, ' ').padEnd(markColumnWidth, ' ');
    table.setHeading(commandHeading, chatHeading, slashHeading);

    rows.forEach((row, index) => {
        // Center the marks within their column width
        let chatLoaded = row.isChatCommand ? '✅' : '❌';
        let slashLoaded = row.isSlashCommand ? '✅' : '❌';
        chatLoaded = chatLoaded.padStart((markColumnWidth + chatLoaded.length) / 2).padEnd(markColumnWidth, ' ');
        slashLoaded = slashLoaded.padStart((markColumnWidth + slashLoaded.length) / 2).padEnd(markColumnWidth, ' ');

        // Handle new category
        if (row.dirName !== currentDir) {
            if (currentDir !== '') {
                table.addRow(''); // Add an empty row for spacing
            }
            // Add the directory name left-aligned
            table.addRow(row.dirName.toUpperCase(), '', '');
            currentDir = row.dirName;
        }

        // Determine the prefix for the command row, left-aligned
        const prefix = (index === rows.length - 1 || (rows[index + 1] && rows[index + 1].dirName !== currentDir)) ? '└─ ' : '├─ ';
        const fileName = prefix + row.fileName.padEnd(markColumnWidth - prefix.length, ' ');

        // Add the command row with centered marks
        table.addRow(fileName, chatLoaded, slashLoaded);
    });
}

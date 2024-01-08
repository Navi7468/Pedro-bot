const { Routes, REST } = require('discord.js');
const AsciiTable = require('ascii-table');
const logger = require('../util/logger');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;

const testing = process.env.TESTING === "true" ? true : false;
const TOKEN = testing ? process.env.TESTING_TOKEN : process.env.CLIENT_TOKEN;
const CLIENT_ID = testing ? process.env.TESTING_CLIENT_ID : process.env.CLIENT_ID;

let table = new AsciiTable();
table.setHeading("Command", "Chat", "Slash").setBorder("|", "-", "+", "+");

module.exports = async (client) => {
    const commands = [];
    let categoryRows = [];

    const readCommands = async (dir, baseDir = "") => {
        const files = await fs.readdir(path.resolve(dir));

        for (const file of files) {
            const fullPath = path.resolve(dir, file);
            const stat = await fs.lstat(fullPath);

            if (stat.isDirectory()) {
                await readCommands(path.join(dir, file), baseDir + file);
            } else if (file.endsWith(".js")) {
                try {
                    const command = require(fullPath);
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
                    process.exit(1); // Exit process if a command fails to load
                }
            }
        }
    };

    await readCommands("./src/commands");

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
        await rest.put( Routes.applicationCommands(CLIENT_ID), { body: formattedCommands });
        logger.info(`Successfully loaded application commands.`);    
    } catch (error) {
        logger.error(`Failed to reload application (/) commands: ${error}`);
    }
};

function formatRows(rows) {
    const markColumnWidth = 7;  // Width of the Chat and Slash columns
    let currentDir = "";

    // Function to center marks within their column width
    const centerMark = (mark) => mark.padStart((markColumnWidth + mark.length) / 2).padEnd(markColumnWidth, ' ');

    // Apply centered headings for Chat and Slash, left-aligned for Command
    const commandHeading = 'Command'.padEnd(markColumnWidth, ' ');
    const chatHeading = centerMark('Chat');
    const slashHeading = centerMark('Slash');
    table.setHeading(commandHeading, chatHeading, slashHeading);

    rows.forEach((row, index) => {
        let chatLoaded = centerMark(row.isChatCommand ? '✅' : '❌');
        let slashLoaded = centerMark(row.isSlashCommand ? '✅' : '❌');

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
        const fileName = `${prefix}${row.fileName.padEnd(markColumnWidth - prefix.length, ' ')}`;

        // Add the command row with centered marks
        table.addRow(fileName, chatLoaded, slashLoaded);
    });
}
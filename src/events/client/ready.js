const client = require("../../..");
const chalk = require("chalk");

client.on('ready', async () => {
    console.log(chalk.greenBright(`Logged in as ${client.user.tag}!`));
});
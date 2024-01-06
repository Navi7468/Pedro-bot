const logger = require('../../util/logger');
const client = require('../../..');
const chalk = require('chalk');

client.on('guildMemberAdd', async (member) => {
    console.log(chalk.greenBright(`${member.user.tag} joined the server!`));
});
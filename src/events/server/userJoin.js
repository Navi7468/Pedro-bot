const config = require('../../../configs/servers.json');
const logger = require('../../util/logger');
const client = require('../../..');
const chalk = require('chalk');

client.on('guildMemberAdd', async (member) => {
    console.log(chalk.greenBright(`${member.user.tag} joined the server!`));
    logger.info(`${member.user.tag} joined the server!`);

    const guild = member.guild;
    const server = config.servers[guild.id];
    if (!server) return;

    const memberJoin = server.events.memberJoin;

    const welcomeChannel = guild.channels.cache.get(memberJoin.channel);
    if (!welcomeChannel) return;

    var welcomeMessage = memberJoin.messages[Math.floor(Math.random() * memberJoin.messages.length)]
        .replace(/{user}/g, member.user)
        .replace(/{server}/g, guild.name)
        .replace(/{memberCount}/g, guild.memberCount);

    welcomeChannel.send({ content: welcomeMessage });

    if (member.user.bot) {
        const botRole = guild.roles.cache.get(server.roles.bot);
        await member.roles.add(botRole);
        if (!botRole) return logger.error(`Bot role ${server.roles.bot} does not exist in ${guild.name} (${guild.id}) and cannot be assigned to ${member.user.tag} (${member.user.id})`);
    }
    
    server.roles.default.forEach(role => {
        if (!guild.roles.cache.get(role)) return logger.error(`Role ${role} does not exist in ${guild.name} (${guild.id}) and cannot be assigned to ${member.user.tag} (${member.user.id})`);
        member.roles.add(role);
        logger.info(`Assigned role ${role} to ${member.user.tag} (${member.user.id}) in ${guild.name} (${guild.id})`);
    });
});
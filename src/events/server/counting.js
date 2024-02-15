const { serverSchema } = require('@models');
const logger = require('@utils/logger');
const client = require('@client');

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const server = await serverSchema.findOne({ guildId: message.guild.id });
    if (!server || !server.events.messageCount?.enabled) return;


});
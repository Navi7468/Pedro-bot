const { EmbedBuilder, AuditLogEvent, Events } = require('discord.js');
const { serverSchema } = require('@models');
const { fontConverter } = require('@utils');
const logger = require('@utils/logger');
const client = require('@client');

// TODO: Allow for server-specific font settings (Database implementation)
// TODO: Add server logging for channel creation, deletion, and updates

client.on('channelCreate', async (channel) => {
    // replace the channel name with the font converted name
    const newChannelName = fontConverter(channel.name);
    await channel.setName(newChannelName);
    logger.info(`Channel ${channel.name} has been created`);

});

client.on('channelUpdate', async (oldChannel, newChannel) => {
    // replace the channel name with the font converted name
    const newChannelName = fontConverter(newChannel.name);

    // Check if the channel name is already in the converted format
    if (newChannel.name === newChannelName) return;

    await newChannel.setName(newChannelName);
    logger.info(`Channel ${newChannel.name} has been updated`);
});
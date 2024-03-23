const { EmbedBuilder } = require('discord.js');
const { serverSchema } = require('@models');
const logger = require('@utils/logger');
const client = require('@client');

client.on('inviteCreate', async invite => {
    const server = await serverSchema.findOne({ guildId: invite.guild.id });
    if (!server) return;

    if (!server.events.inviteCreate.enabled) return;
    const loggingChannel = invite.guild.channels.cache.get(server.events.inviteCreate.channelId);
    if (!loggingChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('Invite link created')
        .setDescription(`An invite link has been created for ${invite.channel} by ${invite.inviter}`)
        .setColor(server.events.inviteCreate.embed.color || 'yellow')
        .setTimestamp();

    loggingChannel.send({ embeds: [embed] }).catch(e => {
        logger.error('inviteCreate event', e);
    });
});
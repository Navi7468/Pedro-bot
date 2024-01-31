const { EmbedBuilder } = require('discord.js');
const { serverSchema, userSchema } = require('@models');
const logger = require('@utils/logger');
const client = require('@client');

client.on('guildMemberRemove', async (member) => {
    const guild = member.guild;
    const guildUser = guild.members.cache.get(member.user.id);
    logger.info(`User ${member.user.username} (${member.user.id}) left ${guild.name} (${guild.id})`);

    const server = await serverSchema.findOne({ guildId: guild.id });
    if (!server) return logger.error(`Server ${guild.name} (${guild.id}) does not exist in the database`);

    const memberLeave = server.events.memberLeave;
    if (!memberLeave.enabled) return logger.info(`Member leave event is disabled in ${guild.name} (${guild.id})`);

    const leaveChannel = guild.channels.cache.get(memberLeave.channelId);
    if (!leaveChannel) return logger.error(`Leave channel ${memberLeave.channelId} does not exist in ${guild.name} (${guild.id})`);

    var leaveMessage = memberLeave.messages[Math.floor(Math.random() * memberLeave.messages.length)]
        .replace(/{user}/g, member.user)
        .replace(/{server}/g, guild.name)
        .replace(/{memberCount}/g, guild.memberCount);

    if (memberLeave.type === 'message') {
        leaveChannel.send({ content: leaveMessage });
    } else if (memberLeave.type === 'embed') {
        const embed = new EmbedBuilder()
            .setTitle(member.user.tag)
            .setDescription(leaveMessage)
            .setColor(memberLeave.embed.color)
            .setTimestamp(memberLeave.embed.timestamp ? new Date() : null)
            .setAuthor(memberLeave.embed.author.name, memberLeave.embed.author.icon_url)
            .setThumbnail(memberLeave.embed.thumbnail)
            .setFooter(memberLeave.embed.footer);
        leaveChannel.send({ embeds: [embed] });
    } else {
        logger.error(`Invalid event type ${memberLeave.type} in ${guild.name} (${guild.id})`);
    }
});
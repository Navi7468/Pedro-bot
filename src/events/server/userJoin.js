const { EmbedBuilder } = require('discord.js');
const serverSchema = require('../../models/serverSchema');
const userSchema = require('../../models/userSchema');
const logger = require('../../util/logger');
const client = require('../../..');

client.on('guildMemberAdd', async (member) => {
    const guild = member.guild;
    logger.info(`User ${member.user.username} (${member.user.id}) joined ${guild.name} (${guild.id})`);

    const server = await serverSchema.findOne({ guildId: guild.id });
    if (!server) return logger.error(`Server ${guild.name} (${guild.id}) does not exist in the database`);

    const memberJoin = server.events.memberJoin;
    if (!memberJoin.enabled) return logger.info(`Member join event is disabled in ${guild.name} (${guild.id})`);

    const welcomeChannel = guild.channels.cache.get(memberJoin.channelId);
    if (!welcomeChannel) return logger.error(`Welcome channel ${memberJoin.channelId} does not exist in ${guild.name} (${guild.id})`);

    var welcomeMessage = memberJoin.messages[Math.floor(Math.random() * memberJoin.messages.length)]
        .replace(/{user}/g, member.user)
        .replace(/{server}/g, guild.name)
        .replace(/{memberCount}/g, guild.memberCount);

    if (memberJoin.type === 'message') {
        welcomeChannel.send({ content: welcomeMessage });
    } else if (memberJoin.type === 'embed') {
        const embed = new EmbedBuilder()
            .setTitle(member.user.tag)
            .setDescription(welcomeMessage)
            .setColor(memberJoin.embed.color)
            .setTimestamp(memberJoin.embed.timestamp ? new Date() : null)
            .setAuthor(memberJoin.embed.author.name, memberJoin.embed.author.icon_url)
            .setThumbnail(memberJoin.embed.thumbnail)
            .setFooter(memberJoin.embed.footer);
        welcomeChannel.send({ embeds: [embed] });
    } else {
        logger.error(`Invalid event type ${memberJoin.type} in ${guild.name} (${guild.id})`);
    }

    if (member.user.bot) {
        const botRole = guild.roles.cache.get(server.roles.bot.id);
        if (!botRole) return logger.error(`Bot role ${server.roles.bot.id} does not exist in ${guild.name} (${guild.id}) and cannot be assigned to ${member.user.tag} (${member.user.id})`);
        await member.roles.add(botRole);
    } else {
        server.roles.default.forEach(role => {
            if (!guild.roles.cache.get(role.id)) return logger.error(`Role ${role.id} does not exist in ${guild.name} (${guild.id}) and cannot be assigned to ${member.user.tag} (${member.user.id})`);
            member.roles.add(role.id);
            logger.info(`Assigned role ${role.id} to ${member.user.tag} (${member.user.id}) in ${guild.name} (${guild.id})`);
        });
    }

    const user = await userSchema.findOne({ userId: member.user.id });
    if (user) return logger.info(`User ${member.user.tag} (${member.user.id}) already exists in the database`);

    const newUser = new userSchema({
        userId: member.user.id,
        username: member.user.username,
        globalName: member.user.username
    });
    await newUser.save();
    logger.info(`User ${member.user.tag} (${member.user.id}) added to the database`);
});
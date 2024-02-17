const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { serverSchema } = require('@models');
const logger = require('@utils/logger');
const client = require('@client');

// Handle message deletion
client.on('messageDelete', async (message) => {
    if (message.partial) await message.fetch();
    if (message.author.bot) return;

    const guild = message.guild;
    const server = await serverSchema.findOne({ guildId: guild.id });
    if (!server || !server.events.messageDelete.enabled) return;

    let executor = undefined;

    const logs = await message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        limit: 1,
    });
    // logs.entries is a collection, so grab the first one
    const firstEntry = logs.entries.first();
    const { executorId, target, targetId } = firstEntry;
    // Ensure the executor is cached
    const user = await client.users.fetch(executorId);
    target ? (executor = user) : (executor = targetId);

    const logChannel = guild.channels.cache.get(server.events.messageDelete.channelId);
    if (!logChannel) return;

    const randomMessageTemplate = server.events.messageDelete.messages[Math.floor(Math.random() * server.events.messageDelete.messages.length)];
    let logMessage = randomMessageTemplate
        .replace(/{globalname}/g, message.author.username)
        .replace(/{channel}/g, message.channel.id)
        .replace(/{executor}/g, executor || 'Unknown')
        .replace(/{user}/g, message.author)
        .replace(/{avatar}/g, message.author.displayAvatarURL())
        .replace(/{content}/g, message.content || '[Content Not Available]');

    const embedData = server.events.messageDelete.embed;
    const embed = new EmbedBuilder()
        .setTitle(embedData.title)
        .setDescription(logMessage)
        .setColor(embedData.color)
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setTimestamp(embedData.timestamp ? new Date() : null);

    // Set the thumbnail as the image of the deleted message if it exists 
    if (logMessage.includes('[Content Not Available]')) {
        const attachments = message.attachments;
        // console.log(attachments);
        let type = 'Attachment';
        if (message.attachments.size > 0) {
            embed.setThumbnail(attachments.first().url);
            // replace "[Content Not Available]" with "Attachment" or "Attachments"
            attachments.size > 1 ? type = 'Attachments' : type = 'Attachment';

            logMessage = logMessage.replace('[Content Not Available]', type);
            
            embed.setDescription(`${logMessage}`);   
            // for (const [key, attachment] of attachments) {
            //     embed.addFields({ name: `Attachment ${key}`, value: attachment.url, inline: true });
            // }         
            Array.from(attachments.values()).forEach((attachment, index) => {
                embed.addFields({ name: `Attachment ${index + 1}`, value: attachment.url, inline: true });
            });
        }
    }
        
    logChannel.send({ embeds: [embed] });
});

// Handle message update
client.on('messageUpdate', async (oldMessage, newMessage) => {
    try {
        if (oldMessage.partial) oldMessage = await oldMessage.fetch();
        if (newMessage.partial) newMessage = await newMessage.fetch();

        // If the content didn't change or the message is from a bot, don't proceed
        if (oldMessage.content === newMessage.content || oldMessage.author?.bot) return;

        const guild = oldMessage.guild;
        const server = await serverSchema.findOne({ guildId: guild.id });
        if (!server || !server.events.messageUpdate?.enabled) return;

        const logChannel = guild.channels.cache.get(server.events.messageUpdate.channelId);
        if (!logChannel) return;

        // Randomly choose a message template from the messages array
        const randomMessageTemplate = server.events.messageUpdate.messages[
            Math.floor(Math.random() * server.events.messageUpdate.messages.length)
        ];

        // Replace placeholders with actual content
        const logMessage = randomMessageTemplate
            .replace(/{globalname}/g, oldMessage.author.username)
            .replace(/{channel}/g, oldMessage.channel.id)
            .replace(/{user}/g, oldMessage.author)
            .replace(/{avatar}/g, oldMessage.author.displayAvatarURL())
            .replace(/{oldContent}/g, oldMessage.content || '[Content Not Available]')
            .replace(/{newContent}/g, newMessage.content || '[Content Not Available]');

        // Construct the embed with replaced values
        const embedData = server.events.messageUpdate.embed;
        const embed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(logMessage)
            .setColor(embedData.color)
            .setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL() })
            .addFields([
                { name: 'Before', value: truncateString(oldMessage.content, 1024), inline: true },
                { name: 'After', value: truncateString(newMessage.content, 1024), inline: true }
            ])
            .setTimestamp(embedData.timestamp ? new Date() : null);

        // Send the embed to the log channel
        logChannel.send({ embeds: [embed] });
    } catch (error) {
        console.error('An error occurred in messageUpdate event:', error);
        // Handle errors appropriately in your environment
    }
});

// Helper function to truncate strings that exceed the field value limit
function truncateString(str, num) {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}

const { EmbedBuilder, AuditLogEvent, Events } = require('discord.js');
const { serverSchema } = require('@models');
const { replaceText } = require('@utils');
const logger = require('@utils/logger');
const client = require('@client');

// Handle message deletion
// client.on('messageDelete', async (message) => {
//     if (message.partial) await message.fetch();
//     if (message.author.bot) return;

//     const guild = message.guild;
//     const server = await serverSchema.findOne({ guildId: guild.id });
//     if (!server || !server.events.messageDelete.enabled) return;

//     let executor = undefined;

//     const logs = await message.guild.fetchAuditLogs({
//         type: AuditLogEvent.MessageDelete,
//         limit: 1,
//     });
//     // logs.entries is a collection, so grab the first one
//     const firstEntry = logs.entries.first();
//     const { executorId, target, targetId } = firstEntry;
//     // Ensure the executor is cached
//     const user = await client.users.fetch(executorId);
//     target ? (executor = user) : (executor = targetId);

//     const logChannel = guild.channels.cache.get(server.events.messageDelete.channelId);
//     if (!logChannel) return;

//     const randomMessageTemplate = server.events.messageDelete.messages[Math.floor(Math.random() * server.events.messageDelete.messages.length)];
//     console.log(randomMessageTemplate);
//     const logMessage = replaceText(randomMessageTemplate, {
//         guild: guild,
//         message: message,
//         executor: executor,
//         user: message.author,
//     });
//     // const logMessages = randomMessageTemplate
//     //     .replace(/{globalname}/g, message.author.username)
//     //     .replace(/{channel}/g, message.channel.id)
//     //     .replace(/{executor}/g, executor || 'Unknown')
//     //     .replace(/{user}/g, message.author)
//     //     .replace(/{avatar}/g, message.author.displayAvatarURL())
//     //     .replace(/{content}/g, message.content || '[Content Not Available]');

//     const embedData = server.events.messageDelete.embed;
//     const embed = new EmbedBuilder()
//         .setTitle(embedData.title)
//         .setDescription(logMessage)
//         .setColor(embedData.color)
//         .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
//         .setTimestamp(embedData.timestamp ? new Date() : null);

//     logChannel.send({ embeds: [embed] });
// });

client.on(Events.GuildAuditLogEntryCreate, async (auditLog) => {
    console.log(`Audit log event type: ${auditLog.type}`);
    // Define your variables
    const { action, executorId, target, targetId } = auditLog;

    // Check only for deleted messages
    if (action !== AuditLogEvent.MessageDelete || target.bot) return;

    // Ensure the executor is cached
    const user = await client.users.fetch(executorId);

    const guild = target.guild;
    const server = await serverSchema.findOne({ guildId: guild.id });
    if (!server || !server.events.messageDelete.enabled) return;

    const logChannel = guild.channels.cache.get(server.events.messageDelete.channelId);
    if (!logChannel) return;

    const randomMessageTemplate = server.events.messageDelete.messages[Math.floor(Math.random() * server.events.messageDelete.messages.length)];
    const logMessage = replaceText(randomMessageTemplate, {
        guild: guild,
        message: target,
        executor: user,
        user: target.author,
    });

    const embedData = server.events.messageDelete.embed;
    const embed = new EmbedBuilder()
        .setTitle(embedData.title)
        .setDescription(logMessage)
        // .setColor(embedData.color)
        .setColor("#0000FF")
        .setAuthor({ name: target.author.tag, iconURL: target.author.displayAvatarURL() })
        .setTimestamp(embedData.timestamp ? new Date() : null);

    logChannel.send({ embeds: [embed] });

    if (target) {
        // The message object is in the cache and you can provide a detailed log here
        console.log(`A message by ${target.tag} was deleted by ${user.tag}.`);
    } else {
        // The message object was not cached, but you can still retrieve some information
        console.log(`A message with id ${targetId} was deleted by ${user.tag}.`);
    }
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
        if (!server || !server.events.messageUpdate.enabled) return;

        const logChannel = guild.channels.cache.get(server.events.messageUpdate.channelId);
        if (!logChannel) return;

        // Randomly choose a message template from the messages array
        const randomMessageTemplate = server.events.messageUpdate.messages[
            Math.floor(Math.random() * server.events.messageUpdate.messages.length)
        ];

        // Replace placeholders with actual content
        // const logMessages = replaceText(randomMessageTemplate, {
        //     guild: guild,
        //     oldMessage: oldMessage,
        //     newMessage: newMessage
        // });
        const logMessage = randomMessageTemplate
            .replace(/{globalname}/g, oldMessage.author.username)
            .replace(/{channel}/g, oldMessage.channel.id)
            .replace(/{user}/g, oldMessage.author.tag)
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

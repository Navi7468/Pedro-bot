const { serverSchema } = require('@models'); // MongoDB server schema
const { Collection } = require('discord.js');
const logger = require('@utils/logger');
const client = require('@client');

const reactionCooldowns = new Collection();
const reactionSpamCount = new Collection();
const reactionTimeouts = new Collection();
const cooldownDuration = 3000; // Cooldown duration in milliseconds
const spamThreshold = 3; // Number of reactions considered as spamming
const timeoutDuration = 60000; // Timeout duration in milliseconds (e.g., 60000ms = 60 seconds)

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    const guild = reaction.message.guild;
    const message = reaction.message;

    try {
        const cooldownKey = `${user.id}-${message.id}`;
        const currentTime = Date.now();
        const lastReactionTime = reactionCooldowns.get(cooldownKey);
        const spamCount = reactionSpamCount.get(user.id) || 0;

        // Check if the user is in timeout
        if (reactionTimeouts.has(user.id)) {
            await reaction.users.remove(user.id); // Remove reaction as user is in timeout
            return;
        }

        if (lastReactionTime && (currentTime - lastReactionTime) < cooldownDuration) {
            reactionSpamCount.set(user.id, spamCount + 1);

            if (spamCount + 1 >= spamThreshold) {
                try {
                    await user.send('You are reacting too fast! Please slow down.');
                } catch (dmError) {
                    console.error('Could not send DM to user:', dmError);
                }

                reactionTimeouts.set(user.id, true); // Set user in timeout
                setTimeout(() => reactionTimeouts.delete(user.id), timeoutDuration); // Remove user from timeout after duration
                reactionSpamCount.set(user.id, 0); // Reset spam count
                return;
            }
            return; // Ignore reaction as it's within the cooldown period
        }

        reactionSpamCount.set(user.id, 0);
        reactionCooldowns.set(cooldownKey, currentTime);

        const server = await serverSchema.findOne({ guildId: guild.id });
        if (!server) return logger.error(`Server ${guild.name} (${guild.id}) does not exist in the database`);

        const guildUser = guild.members.cache.get(user.id);
        if (!guildUser) return;

        const selectRole = server.roles.selfRoles.find(roleCategory => roleCategory.reactionId === message.id);
        if (!selectRole) return;

        const role = selectRole.roles.find(r => r.emoji === reaction.emoji.name);
        if (!role) {
            await reaction.users.remove(user.id);
            return;
        }

        // Ensure the bot has reacted with all necessary emojis
        for (const role of selectRole.roles) {
            const hasReacted = message.reactions.cache.some(r => r.emoji.name === role.emoji && r.users.cache.has(client.user.id));
            if (!hasReacted) {
                await message.react(role.emoji);
            }
        }

        // Handle single role logic
        if (selectRole.single) {
            const fetchedMessage = await message.fetch();
            fetchedMessage.reactions.cache.each(async (reactionOfMessage) => {
                if (reactionOfMessage.emoji.name !== reaction.emoji.name) {
                    await reactionOfMessage.users.remove(user.id);
                }
            });
        }

        await guildUser.roles.add(role.id);
    } catch (error) {
        console.error('An error occurred:', error);
    }
});



client.on('messageReactionRemove', async (reaction, user) => {
    const guild = reaction.message.guild;
    const server = await serverSchema.findOne({ guildId: guild.id });
    if (!server) return logger.error(`Server ${guild.name} (${guild.id}) does not exist in the database`);
    const guildUser = guild.members.cache.get(user.id);
    if (!guildUser) return;

    const selfRoles = server.roles.selfRoles;
    const selectRole = selfRoles.find((roleCategory) => roleCategory.reactionId === reaction.message.id);
    if (!selectRole) return;

    const role = selectRole.roles.find((role) => role.emoji === reaction.emoji.name);
    if (!role) return;

    // If the user is the bot, react to the message again
    if (user.id === client.user.id) {
        reaction.message.react(reaction.emoji);
        return;
    }

    if (!guildUser.roles.cache.has(role.id)) return;
    guildUser.roles.remove(role.id).catch(console.error);
});



/*
// Handle single role logic
        if (selectRole.single) {
            const fetchedMessage = await message.fetch();
            fetchedMessage.reactions.cache.each(async (reactionOfMessage) => {
                if (reactionOfMessage.emoji.name !== reaction.emoji.name) {
                    await reactionOfMessage.users.remove(user.id);
                }
            });
        }
*/ 
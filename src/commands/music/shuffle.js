const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    name: 'shuffle',
    description: 'Shuffles the queue.',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction) => {
        await shuffleQueue(client, interaction);
    },
    chat: async (client, message) => {
        await shuffleQueue(client, message);
    }
};

async function shuffleQueue(client, interactionOrMessage) {
    const member = interactionOrMessage.member;
    if (!member.voice.channel) {
        return interactionOrMessage.reply('You need to be in a voice channel to shuffle the queue!');
    }

    try {
        const queue = useQueue(interactionOrMessage.guild.id);
        
        if (!queue) {
            return interactionOrMessage.reply('There is no song playing.');
        }

        queue.shuffle();
        interactionOrMessage.reply(`🎶 Shuffled the queue.`);

    } catch (error) {
        console.error('Error shuffling the queue:', error);
        interactionOrMessage.reply('There was an error trying to shuffle the queue.');
    }
}
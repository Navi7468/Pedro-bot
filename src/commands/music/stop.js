const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    name: 'stop',
    description: 'Stops the queue and leaves the voice channel.',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction) => {
        await stopSong(client, interaction);
    },
    chat: async (client, message) => {
        await stopSong(client, message);
    }
};

async function stopSong(client, interactionOrMessage) {
    const member = interactionOrMessage.member;
    if (!member.voice.channel) {
        return interactionOrMessage.reply('You need to be in a voice channel to stop music!');
    }

    try {
        const queue = useQueue(interactionOrMessage.guild.id);

        if (!queue) {
            return interactionOrMessage.reply('There is no song playing.');
        }

        queue.node.stop();
        interactionOrMessage.reply(`🎶 Stopped the queue.`);

    } catch (error) {
        console.error('Error stopping the queue:', error);
        interactionOrMessage.reply('There was an error trying to stop the queue.');
    }
}
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    name: 'skip',
    description: 'Skips the current song.',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction) => {
        await skipSong(client, interaction);
    },
    chat: async (client, message) => {
        await skipSong(client, message);
    }
};

async function skipSong(client, interactionOrMessage) {
    const member = interactionOrMessage.member;
    if (!member.voice.channel) {
        return interactionOrMessage.reply('You need to be in a voice channel to skip music!');
    }

    try {
        const queue = useQueue(interactionOrMessage.guild.id);
        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;

        if (!queue) {
            return interactionOrMessage.reply('There is no song playing.');
        }

        queue.node.skip();
        interactionOrMessage.reply(`🎶 Skipped **${currentTrack.title}**`);

    } catch (error) {
        console.error('Error skipping the song:', error);
        interactionOrMessage.reply('There was an error trying to skip the song.');
    }
}
const { ApplicationCommandType } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    name: 'resume',
    description: 'Resumes the current song.',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction) => {
        await resumeSong(client, interaction);
    },
    chat: async (client, message) => {
        await resumeSong(client, message);
    }
};

async function resumeSong(client, interactionOrMessage) {
    const member = interactionOrMessage.member;
    if (!member.voice.channel) {
        return interactionOrMessage.reply('You need to be in a voice channel to resume music!');
    }

    try {
        const queue = useQueue(interactionOrMessage.guild.id);
        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;

        if (!queue) {
            return interactionOrMessage.reply('There is no song playing.');
        }

        const isPaused = queue.node.isPaused();

        if (!isPaused) {
            return interactionOrMessage.reply('The song is already playing.');
        }

        queue.node.setPaused(false);
        interactionOrMessage.reply(`🎶 Resumed **${currentTrack.title}**`);

    } catch (error) {
        console.error('Error resuming the song:', error);
        interactionOrMessage.reply('There was an error trying to resume the song.');
    }
}
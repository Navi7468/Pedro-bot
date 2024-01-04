const { ApplicationCommandType } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    name: 'pause',
    description: 'Pauses the current song.',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction) => {
        await pauseSong(client, interaction);
    },
    chat: async (client, message) => {
        await pauseSong(client, message);
    }
};

async function pauseSong(client, interactionOrMessage) {
    const member = interactionOrMessage.member;
    if (!member.voice.channel) {
        return interactionOrMessage.reply('You need to be in a voice channel to pause music!');
    }

    try {
        const queue = useQueue(interactionOrMessage.guild.id);
        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;

        if (!queue) {
            return interactionOrMessage.reply('There is no song playing.');
        }

        const isPaused = queue.node.isPaused();

        if (isPaused) {
            return interactionOrMessage.reply('The song is already paused.');
        }

        queue.node.setPaused(true);
        console.log(currentTrack);
        interactionOrMessage.reply(`🎶 Paused **${currentTrack.title}**`);
        
    } catch (error) {
        console.error('Error pausing the song:', error);
        interactionOrMessage.reply('There was an error trying to pause the song.');
    }
}
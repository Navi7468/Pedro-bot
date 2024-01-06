const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    name: 'queue',
    description: 'Shows the current queue.',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction) => {
        await queue(client, interaction);
    },
    chat: async (client, message) => {
        await queue(client, message);
    }
};

async function queue(client, interactionOrMessage) {
    const member = interactionOrMessage.member;
    if (!member.voice.channel) {
        return interactionOrMessage.reply('You need to be in a voice channel to see the queue!');
    }

    try {
        const queue = useQueue(interactionOrMessage.guild.id);
        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;
        
        if (!queue) {
            return interactionOrMessage.reply('There is no song playing.');
        }

        const embed = new EmbedBuilder()
            .setTitle('**Queue**')
            .setColor('#5f7b94')
            .setDescription(`**Current Track:** ${currentTrack.title}`)
            .setTimestamp();

        const maxTracks = Math.min(tracks.length, 25);
        for (let i = 0; i < maxTracks; i++) {
            const track = tracks[i];
            // embed.addFields(`#${i + 1}`, track.title);
            embed.addFields({ name: `#${i + 1}`, value: `${track.title}` });
        }

        interactionOrMessage.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Error getting the queue:', error);
        interactionOrMessage.reply('There was an error trying to get the queue.');
    }
}
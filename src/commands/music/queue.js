const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    name: 'queue',
    description: 'Shows the current music queue.',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction) => {
        await showQueue(client, interaction, true); // Indicates this is a slash command
    },
    chat: async (client, message) => {
        await showQueue(client, message, false); // Indicates this is a chat command
    },
};

async function showQueue(client, interactionOrMessage, isSlashCommand) {
    try {
        const member = isSlashCommand ? interactionOrMessage.member : interactionOrMessage.author;
        const voiceChannel = member.voice.channel;
        const reply = (content) => {
            if (isSlashCommand) {
                return interactionOrMessage.reply(content);
            } else {
                return interactionOrMessage.channel.send(content);
            }
        };

        if (!voiceChannel) {
            return reply({ content: 'You need to be in a voice channel to see the queue!' });
        }

        const queue = useQueue(interactionOrMessage.guild.id);
        if (!queue || !queue.isPlaying()) {
            return reply('There is no music currently playing in the queue.');
        }

        const currentTrack = queue.currentTrack;

        // Function to handle the display of artists or authors based on source
        function getSourceLink(track) {
            if (track.raw.source === 'youtube') {
                return `[**${track.author}**](https://www.youtube.com/channel/${track.raw.channel.id})`;
            } else if (track.raw.source === 'spotify' && track.metadata.source.artists && track.metadata.source.artists.length > 0) {
                return track.metadata.source.artists.map(artist => `[**${artist.name}**](${artist.uri.replace('spotify:artist:', 'https://open.spotify.com/artist/')})`).join(', ');
            } else {
                // Fallback if the artist/channel info isn't as expected
                return `**${track.author}**`;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('Music Queue')
            .setColor('#729aab')
            .setDescription(`Currently playing: [**${currentTrack.title}**](${currentTrack.url}) by ${getSourceLink(currentTrack)}\nQueued by: ${currentTrack.requestedBy}`)
            .setThumbnail(currentTrack.thumbnail)
            .setTimestamp();

        const queueTracks = queue.tracks.toArray();
        const maxTracksDisplay = 10;

        if (queueTracks.length > 0) {
            const trackList = queueTracks.slice(0, maxTracksDisplay).map((track, index) =>
                `${index + 1}. [**${track.title}**](${track.url}) by ${getSourceLink(track)} (${track.duration}) - Queued by: ${track.requestedBy}`).join('\n');
            embed.addFields({ name: 'Up Next', value: trackList });

            if (queueTracks.length > maxTracksDisplay) {
                embed.addFields({ name: 'More Tracks', value: `...and ${queueTracks.length - maxTracksDisplay} more tracks.` });
            }
        } else {
            embed.addFields({ name: 'Up Next', value: 'The queue is currently empty.' });
        }

        return reply({ embeds: [embed] });
    } catch (error) {
        console.error(error);
    }
}
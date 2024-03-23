const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { useQueue } = require("discord-player");

function getSourceLink(track) {
    if (track.raw.source === 'youtube') {
        // Assuming you have the channel ID available. Adjust based on your actual track object structure.
        return `[**${track.author}**](https://www.youtube.com/channel/${track.raw.channel.id})`;
    } else if (track.raw.source === 'spotify' && track.metadata.source.artists && track.metadata.source.artists.length > 0) {
        // Maps through each artist and creates a clickable link to their Spotify profile.
        return track.metadata.source.artists.map(artist => `[**${artist.name}**](${artist.uri.replace('spotify:artist:', 'https://open.spotify.com/artist/')})`).join(', ');
    } else {
        return `**${track.author}**`; // Fallback if neither YouTube nor Spotify or missing metadata.
    }
}

module.exports = {
    id: 'queue',
    permissions: [],
    run: async (client, interaction) => {
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: 'There is no music currently playing!', ephemeral: true });
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

        interaction.reply({ embeds: [embed] });
    }
};
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { useQueue, useMainPlayer, QueryType } = require('discord-player');
const { serverSchema } = require('@models');
const audioFilePath = '/home/navi/Desktop/Pedro-bot/src/audio/quack.mp3';
const logger = require('@utils/logger');

// Define search engines for easy access
const searchEngines = {
    youtube: QueryType.YOUTUBE_SEARCH,
    spotify: QueryType.SPOTIFY_SEARCH,
};

async function autocompleteInteraction(interaction) {
    const player = useMainPlayer();
    const command = interaction.options.getSubcommand();
    const song = interaction.options.getString('song');
    if (!song) return;

    try {
        const results = await player.search(song, { searchEngine: searchEngines[command] });
        // const choices = results.tracks.map(track => ({
        //     name: track.title.length > 100 ? `${track.title.substring(0, 97)}...` : track.title,
        //     value: track.url,
        // }));

        const choices = results.tracks.map(track => {
            let artist = track.author ? ` - ${track.author.split(',')[0]}` : '';
            // console.log(artist.length)
            // let title = track.title.length > 100 ? `${track.title.substring(0, 97)}...` : track.title; 
            let title = track.title.length > 100 ? `${track.title.substring(0, (100 - (artist.length + 4)))} ...` : track.title;
            let name = `${title}${artist}`;

            // If the combined title and artist is too long, truncate it
            if (name.length > 100) {
                name = `${name.substring(0, 96)} ...`;
            }

            return {
                name: name,
                value: track.url,
            };
        });

        await interaction.respond(choices);
    } catch (error) {
        logger.error('Autocomplete error:', error);
        interaction.reply({ content: 'There was an error processing your request.', ephemeral: true });
    }
}

async function executeSlashCommand(client, interaction) {
    const queue = useQueue(interaction.guild.id);
    const song = interaction.options.getString('song');
    const channel = interaction.member.voice.channel;
    const server = await serverSchema.findOne({ guildId: interaction.guild.id });

    if (!channel) {
        return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
    }

    try {
        if (!queue || queue.tracks.length === 0) {

            await client.player.play(channel, audioFilePath, { searchEngine: QueryType.FILE }).then((track) => {
                const player = useQueue(interaction.guild.id); // Use the queue from the guild where the track is playing
                player.node.setVolume(server.volume || 5);
            });
        }

        const { track } = await client.player.play(channel, song, { requestedBy: interaction.user });
        if (!track) {
            return interaction.reply({ content: 'Could not find the track.', ephemeral: true });
        }

        if (!queue || queue.tracks.length === 0) {
            interaction.reply({ content: `Now playing: ${track.title}`, ephemeral: true });
        } else {
            sendTrackEmbed(interaction, track);
        }
    } catch (error) {
        console.error(error);
        logger.error('Error playing the song:', error);
        interaction.reply({ content: 'There was an error trying to play the song.', ephemeral: true });
    }
}

function getSourceLink(track) {
    if (track.raw.source === 'youtube') {
        // Assuming track.raw.channel.id exists and is correct
        const channelUrl = `https://www.youtube.com/channel/${track.raw.channel.id}`;
        return { name: track.author, url: channelUrl };
    } else if (track.raw.source === 'spotify' && track.metadata.source.artists && track.metadata.source.artists.length > 0) {
        // Joining all artist names with links, or just the first artist if preferred
        const artists = track.metadata.source.artists.map(artist => `[${artist.name}](${artist.uri.replace('spotify:artist:', 'https://open.spotify.com/artist/')})`).join(', ');
        return { name: artists, url: null }; // No single URL for multiple artists
    } else {
        // Fallback if the artist/channel info isn't structured as expected
        return { name: track.author, url: null };
    }
}

function sendTrackEmbed(interaction, track) {
    try {
        const { name, url } = getSourceLink(track);
        const artistField = url ? `[${name}](${url})` : name;

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Added to queue' })
            .setTitle(track.title)
            .setURL(track.url)
            .setDescription(`by ${artistField}`)
            .setColor('#24C5F8')
            .setThumbnail(track.thumbnail)
            .setTimestamp()
            .addFields(
                ['artist', 'album', 'duration']
                    .map(field => track[field] ? { name: `${field.charAt(0).toUpperCase()}${field.slice(1)}`, value: track[field], inline: true } : null)
                    .filter(Boolean)
            );

        if (track.requestedBy) {
            embed.addFields({ name: 'Requested By', value: `<@${track.requestedBy.id}>`, inline: true });
        }

        interaction.reply({ embeds: [embed] });
    } catch (error) {
        logger.error('Error sending track embed:', error);
        interaction.reply({ content: 'There was an error sending the track embed.', ephemeral: true });
    }
}

module.exports = {
    name: 'play',
    description: 'Plays a song from Spotify or YouTube.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'spotify',
            description: 'Plays a song from Spotify.',
            type: 1, // Represents a sub-command
            options: [{
                name: 'song',
                description: 'The song you want to play (Spotify URL or search query)',
                type: 3, // Represents a string
                required: true,
                autocomplete: true,
            }],
        },
        {
            name: 'youtube',
            description: 'Plays a song from YouTube.',
            type: 1, // Represents a sub-command
            options: [{
                name: 'song',
                description: 'The song you want to play (YouTube URL or search query)',
                type: 3, // Represents a string
                required: true,
                autocomplete: true,
            }],
        },
    ],
    autocomplete: autocompleteInteraction,
    slash: executeSlashCommand,
};

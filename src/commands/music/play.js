const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { useQueue, useMainPlayer } = require('discord-player');
const logger = require('utils/logger');

module.exports = {
    name: 'play',
    description: 'Plays a song from YouTube, Spotify, or Apple Music.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'song',
            description: 'The song you want to play (YouTube URL or search query)',
            type: 3,
            required: true,
            autocomplete: true
        },
        {
            name: 'using',
            description: 'The service to use to play the song',
            type: 3,
            required: false,
            autocomplete: true
        }
    ],
    autocomplete: async (interaction, choices) => {
        const player = useMainPlayer();
        const query = interaction.options.getString('song');
        if (!query) return;

        const results = await player.search(query);
        results.tracks.forEach((track, index) => {
            choices.push({
                name: track.title,
                value: track.title
            });
        });

        await interaction.respond(choices).catch(console.error);
    },
    slash: async (client, interaction) => {
        const song = interaction.options.getString('song');

        if (!interaction.member.voice.channel) {
            return interaction.reply('You need to be in a voice channel to play music!');
        }

        try {
            const queue = useQueue(interaction.guild.id);
            const { track } = await client.player.play(interaction.member.voice.channel, song, {
                metadata: {
                    channel: interaction
                },
                requestedBy: interaction.user,
                volume: 25,
                leaveOnEnd: false,
                leaveOnStop: false,
                leaveOnEmpty: true
            });

            if (track) {
                const isNowPlaying = !queue || queue.tracks.length === 0;
                sendTrackEmbed(interaction, track, isNowPlaying);
            } else {
                interaction.reply('Could not find the track.');
            }
        } catch (error) {
            logger.error('Error playing the song:', error);
            interaction.reply('There was an error trying to play the song.');
        }
    },

};

function sendTrackEmbed(interaction, track, isNowPlaying) {
    const embed = new EmbedBuilder()
        .setTitle(isNowPlaying ? 'Now Playing' : 'Added to Queue')
        .setDescription(`[${track.title}](${track.url})`)
        .setColor('Blue')
        .setThumbnail(track.thumbnail)
        .setTimestamp();

    ['artist', 'album', 'duration'].forEach(field => {
        if (track[field]) {
            embed.addFields({ name: `${field.charAt(0).toUpperCase()}${field.slice(1)}`, value: track[field], inline: true });
        }
    });

    if (track.requestedBy) {
        embed.addFields({ name: 'Requested By', value: `<@${track.requestedBy.id}>`, inline: true });
    }

    interaction.reply({ embeds: [embed], components: isNowPlaying ? [createControlButtons()] : [] });
}

function createControlButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('stop').setLabel('◼').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('pause-play').setLabel('❚❚').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('next').setLabel('▶|').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('queue').setLabel('❐').setStyle(ButtonStyle.Secondary)
    );
}
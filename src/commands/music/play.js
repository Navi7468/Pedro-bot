const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { useQueue, useMainPlayer, QueryType } = require('discord-player');
const audioFilePath = '/home/navi/Desktop/Pedro-bot/src/audio/quack.mp3';
const logger = require('@utils/logger');
const chalk = require('chalk');

const searchEngines = {
    youtube: QueryType.YOUTUBE_SEARCH,
    spotify: QueryType.SPOTIFY_SEARCH,
};

module.exports = {
    name: 'play',
    description: 'Plays a song from \`Spotify\`.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'spotify',
            description: 'Plays a song from \`Spotify\`.',
            type: 1,
            options: [
                {
                    name: 'song',
                    description: 'The song you want to play (Spotify URL or search query)',
                    type: 3,
                    required: true,
                    autocomplete: true
                }                
            ]
        },
        {
            name: 'youtube',
            description: 'Plays a song from \`YouTube\`.',
            type: 1,
            options: [
                {
                    name: 'song',
                    description: 'The song you want to play (YouTube URL or search query)',
                    type: 3,
                    required: true,
                    autocomplete: true
                }
            ]
        }
    ],
    autocomplete: async (interaction, choices) => {
        const player = useMainPlayer();
        const command = interaction.options.getSubcommand(); // spotify or youtube
        const song = interaction.options.getString('song');
        if (!song) return;
     
        const results = await player.search(song, { searchEngine: searchEngines[command] });

        results.tracks.forEach((track, index) => {
            const title = `${track.title} - ${track.author}`;
            const name = title.length > 100 ? `${title.substr(0, 97)}...` : title;

            choices.push({
                name: name,
                value: track.url
            });
        });

        await interaction.respond(choices).catch(console.error);
    },
    slash: async (client, interaction) => {
        const queue = useQueue(interaction.guild.id);
        const song = interaction.options.getString('song');
        const channel = interaction.member.voice.channel || null;

        console.log(chalk.blueBright(`[COMMAND RAN] ${interaction.user.tag}, args:\n${JSON.stringify(interaction.options)}`));

        if (!channel) return interaction.reply('You need to be in a voice channel to play music!');

        try {
            client.player.play(channel, audioFilePath, { searchEngine: QueryType.FILE });

            const { track } = await client.player.play(channel, song, {
                metadata: { channel: channel },
                requestedBy: interaction.user,
            });
            if (!track) return interaction.reply('Could not find the track.');
            
            const isNowPlaying = !queue || queue.tracks.length === 0;
            // client.player.emit('nowPlaying', queue, track);
            sendTrackEmbed(interaction, track, isNowPlaying);

        } catch (error) {
            console.log(error);
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
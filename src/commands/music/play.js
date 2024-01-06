const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { useQueue } = require('discord-player');
const logger = require('../../util/logger');

module.exports = {
    name: 'play',
    description: 'Plays a song from YouTube, Spotify, or Apple Music.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'song',
            description: 'The song you want to play (YouTube URL or search query)',
            type: 3,
            required: true
        }
    ],
    slash: async (client, interaction) => {
        const song = interaction.options.getString('song');
        await handlePlayCommand(client, interaction, song);
    },
    chat: async (client, message) => {
        const args = message.content.split(' ').slice(1);
        const song = args.join(' ');
        await handlePlayCommand(client, message, song);
    }
};

async function handlePlayCommand(client, interactionOrMessage, songQuery) {
    const member = interactionOrMessage.member;
    if (!member.voice.channel) {
        return interactionOrMessage.reply('You need to be in a voice channel to play music!');
    }

    try {
        const queue = useQueue(interactionOrMessage.guild.id);
        const { track } = await client.player.play(member.voice.channel, songQuery, {
            metadata: {
                channel: interactionOrMessage
            },
            requestedBy: interactionOrMessage.user
        });

        if (track) {
            const isNowPlaying = !queue || queue.tracks.length === 0;
            sendTrackEmbed(interactionOrMessage, track, isNowPlaying);
        } else {
            interactionOrMessage.reply('Could not find the track.');
        }
    } catch (error) {
        logger.error('Error playing the song:', error);
        interactionOrMessage.reply('There was an error trying to play the song.');
    }
}

function sendTrackEmbed(interactionOrMessage, track, isNowPlaying) {
    const embed = new EmbedBuilder()
        .setTitle(isNowPlaying ? 'Now Playing' : 'Added to Queue')
        .setDescription(`[${track.title}](${track.url})`)
        .setColor('Blue')
        .setThumbnail(track.thumbnail)
        .setTimestamp();

    ['artist', 'album', 'duration'].forEach(field => {
        if (track[field]) {
            embed.addFields({ name: field.charAt(0).toUpperCase() + field.slice(1), value: track[field], inline: true });
        }
    });

    if (track.requestedBy) {
        embed.addFields({ name: 'Requested By', value: `<@${track.requestedBy.id}>`, inline: true });
    }

    interactionOrMessage.reply({ embeds: [embed], components: isNowPlaying ? [createControlButtons()] : [] });
}

function createControlButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('stop').setLabel('◼').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('pause-play').setLabel('❚❚').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('next').setLabel('▶|').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('queue').setLabel('❐').setStyle(ButtonStyle.Secondary)
    );
}
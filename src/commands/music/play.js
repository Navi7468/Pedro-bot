const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

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
        await playSong(client, interaction, song);
        console.log(`[SLASH] ${interaction.user.tag} used the play command. Song: ${song}`);
    },
    chat: async (client, message) => {
        const args = message.content.split(' ').slice(1);
        const song = args.join(' ');
        await playSong(client, message, song);
        console.log(`[CHAT] ${message.author.tag} used the play command. Song: ${song}`);
    }
};


async function playSong(client, interactionOrMessage, songQuery) {
    const member = interactionOrMessage.member;
    if (!member.voice.channel) {
        return interactionOrMessage.reply('You need to be in a voice channel to play music!');
    }

    try {
        const { track } = await client.player.play(
            member.voice.channel,
            songQuery,
            {
                metadata: {
                    channel: interactionOrMessage.channel
                }
            }
        );


        if (track) {
            interactionOrMessage.reply(`🎶 Now playing **${track.title}**`);
        } else {
            interactionOrMessage.reply('Could not find the track.');
        }
    } catch (error) {
        console.error('Error playing the song:', error);
        interactionOrMessage.reply('There was an error trying to play the song.');
    }
}
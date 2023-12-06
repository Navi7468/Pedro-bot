const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'play',
    description: 'Play a song!',
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
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });

        const query = interaction.options.getString('song');
        await interaction.deferReply();

        console.log(`[PLAY] ${interaction.user.tag} (${interaction.user.id}) requested to play ${query} in ${interaction.member.voice.channel.name} (${interaction.member.voice.channel.id})`);

        try {
            const { track } = await client.player.play(
                interaction.member.voice.channel,
                query,
                {
                    nodeOptions: {
                        metadata: interaction
                    }
                }
            );

            interaction.followUp({ content: `Now playing ${track.title}!` });
        } catch (error) {
            console.log(error);
            return interaction.editReply({ content: 'An error occurred while trying to play the song!', ephemeral: true });
        }
    },
    chat: async (client, message) => {
        if (!message.member.voice.channel) return message.channel.send({ content: 'You must be in a voice channel to use this command!' });

        const query = message.content.split(' ').slice(1).join(' ');
        await message.channel.sendTyping();

        console.log(`[PLAY] ${message.author.tag} (${message.author.id}) requested to play ${query} in ${message.member.voice.channel.name} (${message.member.voice.channel.id})`);

        try {
            const { track } = await client.player.play(
                message.member.voice.channel,
                query,
                {
                    nodeOptions: {
                        metadata: message
                    }
                }
            );

            message.channel.send({ content: `Now playing ${track.title}!` });
        } catch (error) {
            console.log(error);
            return message.channel.send({ content: 'An error occurred while trying to play the song!' });
        }
    }
};
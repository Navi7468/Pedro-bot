const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Pong!',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction, serverDb) => {
        interaction.reply({ content: 'Pong!', ephemeral: true });
    },
    chat: async (client, message) => {
        message.channel.send('Pong!');
    }
}
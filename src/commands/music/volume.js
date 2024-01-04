const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    name: 'volume',
    description: 'Changes the volume of the bot.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'volume',
            description: 'The volume to change to.',
            type: 4,
            required: true
        }
    ],
    slash: async (client, interaction) => {
        const volume = interaction.options.getInteger('volume');

        if (volume < 0 || volume > 100) {
            return interaction.reply('The volume must be between 0 and 100.');
        }

        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return interaction.reply('A song must be playing to change the volume.');
        }

        queue.node.setVolume(volume);
        interaction.reply(`🎶 Changed the volume to **${volume}**`);
    }
};
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const logger = require('../../util/logger');

module.exports = {
    name: 'testing',
    description: 'Testing command',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction, serverDb) => {

        logger.info(`Testing command used in ${interaction.guild.name} (${interaction.guild.id})`);

    }
}
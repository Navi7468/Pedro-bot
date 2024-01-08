const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const logger = require('../../util/logger');
const botSchema = require('../../models/botSchema');
const serverSchema = require('../../models/serverSchema');
const userSchema = require('../../models/userSchema');

module.exports = {
    name: 'testing',
    description: 'Testing command',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction) => {
        if (interaction.user.id !== '900835160986099744') {
            logger.info(`[TESTING COMMAND] ${interaction.user.globalName} attempted to use the command.`);
            return interaction.reply({ content: 'You are not allowed to use this command!' });
        }

        const guild = interaction.guild;
        
    }
}
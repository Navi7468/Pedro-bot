const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

const { botSchema, serverSchema, userSchema } = require('@models')
const logger = require('@utils/logger')

module.exports = {
    name: 'testing',
    description: 'Testing command',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction) => {
        if (interaction.user.id !== '900835160986099744') {
            logger.info(`[TESTING COMMAND] ${interaction.user.globalName} attempted to use the command.`);
            return interaction.reply({ content: 'You are not allowed to use this command!' });
        }

        try {
            const guild = interaction.guild;
            logger.info(`[TESTING COMMAND] ${interaction.user.globalName} used the command in ${guild.name} (${guild.id})`);
            interaction.reply({ content: 'Testing command', ephemeral: false });
        } catch (error) {
            logger.error(`[TESTING COMMAND] Error: ${error.message}`);
            interaction.reply({ content: 'Testing command error', ephemeral: true });
        }
    },
    chat: async (client, message) => {
        try {
            message.channel.send('Testing command');
        } catch (error) {
            console.error(error);
            logger.error(`[TESTING COMMAND] Error: ${error.message}`);
            message.channel.send('Testing command error');
        }
    }
}
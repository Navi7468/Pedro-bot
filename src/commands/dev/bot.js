const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

const { botSchema, serverSchema, userSchema } = require('models')
const logger = require('utils/logger')

module.exports = {
    name: 'bot',
    description: 'Bot command',
    type: ApplicationCommandType.ChatInput,
    slash: async (client, interaction) => {
        // if (interaction.user.id !== '900835160986099744') {
        //     logger.info(`[TESTING COMMAND] ${interaction.user.globalName} attempted to use the command.`);
        //     return interaction.reply({ content: 'You are not allowed to use this command!' });
        // }

        // const guild = interaction.guild;
        console.log("bot command")
        interaction.reply({ content: 'Bot command', ephemeral: true });
    }
}
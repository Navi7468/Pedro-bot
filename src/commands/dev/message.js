const { ApplicationCommandType, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'messagelogs',
    description: 'Set up message logs for your server!',
    options: [
        {
            name: 'channel',
            description: 'The channel to send message logs to',
            type: 7,
            required: true
        }
    ],
    type: ApplicationCommandType.ChatInput,
    userPerms: [ PermissionsBitField.Flags.Administrator ],
    slash: async (client, interaction) => {
        
    }
};
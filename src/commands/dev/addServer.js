const { ApplicationCommandType, EmbedBuilder, PermissionsBitField } = require('discord.js');

const { botSchema, serverSchema, userSchema } = require('@models')
const logger = require('@utils/logger')

module.exports = {
    name: 'addserver',
    description: 'add server',
    type: ApplicationCommandType.ChatInput,
    userPerms: [ PermissionsBitField.Flags.Administrator ],
    slash: async (client, interaction) => {
        const serverid = interaction.guildId;

        // Creaate a new server document
        const newServer = new serverSchema({
            guildId: serverid,
            guildName: interaction.guild.name,
            prefix: '!',
            roles: {
                birthdayRole: null,
                muteRole: null,
                botRole: null,
                autoRoles: [],
                selfRoles: []
            }                        
        });

        // Save the new server document
        await newServer.save()
            .then(() => {
                logger.info(`[SERVER] ${interaction.guild.name} (${interaction.guild.id}) added to the database.`);
                interaction.reply({ content: 'Server added to the database.', ephemeral: true });
            })
            .catch((err) => {
                logger.error(err);
            });
    }
}
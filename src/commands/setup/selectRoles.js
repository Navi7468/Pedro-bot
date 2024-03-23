const { ApplicationCommandType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { serverSchema } = require('@models');

module.exports = {
    name: 'selectroles',
    description: 'Set up the self roles',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'message_id',
            description: 'ID of the message for self roles',
            type: 3, // String type, as Discord IDs are strings
            required: true
        },
        {
            name: 'category_name',
            description: 'Name of the role category',
            type: 3,
            required: true
        },
        {
            name: 'single_role',
            description: 'Whether the user can only have one role from this category',
            type: 5, // Boolean type
            required: true
        }
    ],
    userPerms: [ PermissionsBitField.Flags.Administrator ],
    autocomplete: async (interaction, choices) => {
        const server = await serverSchema.findOne({ guildId: interaction.guild.id });
        if (!server) return logger.error(`Server ${interaction.guild.name} (${interaction.guild.id}) does not exist in the database`);

        const selectRoles = server.roles.selfRoles;

        selectRoles.forEach((roleCategory) => {
            choices.push({ name: roleCategory.name, value: roleCategory.name });
        });

        await interaction.respond(choices).catch(console.error);
    },
    slash: async (client, interaction) => {
        // Fetch server info and message details
        const messageId = interaction.options.getString('message_id');
        const categoryName = interaction.options.getString('category_name');
        const singleRole = interaction.options.getBoolean('single_role');
        const server = await serverSchema.findOne({ guildId: interaction.guild.id });
        if (!server) return interaction.reply({ content: 'Server not found in database.', ephemeral: true });

        try {
            // Fetch the message using the provided ID
            const channelMessages = await interaction.channel.messages.fetch();
            const message = channelMessages.get(messageId);
            if (!message) return interaction.reply({ content: 'Message not found.', ephemeral: true });

            const lines = message.content.split('\n');
            const title = lines[0]; // Assuming the first line is the title
            let rolesWithEmojis = [];

            lines.slice(1).forEach(line => {
                const emojiMatch = line.match(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu);
                const roleMatch = line.match(/<@&(\d+)>/);
                const serverRole = interaction.guild.roles.cache.get(roleMatch[1]);
                
                if (emojiMatch && roleMatch) {
                    rolesWithEmojis.push({
                        name: serverRole.name,
                        id: serverRole.id,
                        emoji: emojiMatch[0]
                    });
                }
            });

            // Update the server document in the database
            const roleCategory = {
                name: categoryName,
                reactionId: messageId,
                single: singleRole,
                roles: rolesWithEmojis
            };

            server.roles.selfRoles.push(roleCategory);
            await server.save();

            // React to all the reactions available in the message
            for (const role of rolesWithEmojis) {
                await message.react(role.emoji);
            }

            await interaction.reply({ content: `Self roles have been set up with title: ${categoryName}`, ephemeral: true });
        } catch (error) {
            console.error('An error occurred:', error);
            await interaction.reply({ content: 'An error occurred while setting up self roles.', ephemeral: true });
        }
    }
};
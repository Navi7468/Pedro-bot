const { ApplicationCommandType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { serverSchema } = require('@models');
const logger = require('@utils/logger');

module.exports = {
    name: 'schema',
    description: 'Update the schema for the server',
    type: ApplicationCommandType.ChatInput,
    userPerms: [PermissionsBitField.Flags.Administrator],
    slash: async (client, interaction) => {
        if (interaction.user.id !== '900835160986099744') {
            logger.info(`[DEV] ${interaction.user.tag} used the schema command!`);
            return interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true });
        }

        const server = await serverSchema.findOne({ guildId: interaction.guild.id });
        let updated = false;

        const messageDelete = {
            enabled: true,
            channelId: '1202071258288889866',
            messages: ['**{globalname}** deleted a message in <#{channel}>:\n{content}'],
            type: 'embed',
            embed: {
                title: 'Message Deleted',
                description: '{message}',
                color: '#FF0000',
                author: { name: '{user}', icon_url: '{avatar}' },
                fields: [],
                thumbnail: null,
                footer: null,
                timestamp: true
            }
        };

        const messageUpdate = {
            enabled: true,
            channelId: '1202071258288889866',
            messages: ['**{globalname}** edited a message in <#{channel}>:'],
            type: 'embed',
            embed: {
                title: 'Message Edited',
                description: '{message}',
                color: '#FFA500',
                author: { name: '{user}', icon_url: '{avatar}' },
                fields: [{ name: 'Before', value: '{oldContent}', inline: true }, { name: 'After', value: '{newContent}', inline: true }],
                thumbnail: null,
                footer: null,
                timestamp: true
            }
        };

        const counting = {
            enabled: true,
            channelId: '1201292237250760784',
            messages: [
                '{user} broke the chain at {number}!',
                '{user} ruined everything at {number}!',
                '{user} made a mistake at {number}!',
                '{user} messed up at {number}!',
                'You had one job, {user}!!! The number was {number}!',
                'Why, {user}, why? The number was {number}!'
            ],
            type: 'message',
            embed: {
                title: 'Counting',
                description: '{message}',
                color: '#0000FF',
                fields: [],
                thumbnail: null,
                footer: null,
                timestamp: true
            }
        };

        const birthday = {
            enabled: true,
            channelId: '1201301037802324099',
            messages: [
                'It\'s {user}\'s birthday today! 🎉',
                'Happy Birthday to you, {user}!',
                'Everyone, wish {user} a happy birthday! 🎂',
                'Happy Birthday, {user}! 🎈'
            ],
            type: 'embed',
            embed: {
                title: 'Happy Birthday!',
                description: '{message}',
                color: '#FFD700',
                author: { name: '{user}', icon_url: '{avatar}' },
                fields: [],
                thumbnail: '{avatar}',
                footer: null,
                timestamp: true
            }
        };

        server.events.messageDelete = messageDelete;
        server.events.messageEdit = messageUpdate;
        server.events.counting = counting;
        server.events.birthday = birthday;

        updated = true;


        // Save the updated document
        if (updated) {
            await server.save();
            interaction.reply({ content: 'Server schema updated successfully.', ephemeral: true });
        } else {
            interaction.reply({ content: 'No updates needed for the server schema.', ephemeral: true });
        }
    }
}

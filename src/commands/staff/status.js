const { ApplicationCommandType, PermissionsBitField, ActivityType, EmbedBuilder } = require('discord.js');
const botSchema = require('@models/botSchema');
const logger = require('@utils/logger');

module.exports = {
    name: 'status',
    description: 'Set the bot\'s status.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'status',
            description: 'The status to set.',
            type: 3,
            required: false,
            choices: [
                {
                    name: 'online',
                    value: 'online'
                },
                {
                    name: 'idle',
                    value: 'idle'
                },
                {
                    name: 'dnd',
                    value: 'dnd'
                },
                {
                    name: 'invisible',
                    value: 'invisible'
                }
            ]
        },
        {
            name: 'activity',
            description: 'The activity to set.',
            type: 3,
            required: false,
            choices: [
                {
                    name: 'playing',
                    value: 'PLAYING'
                },
                {
                    name: 'streaming',
                    value: 'STREAMING'
                },
                {
                    name: 'listening',
                    value: 'LISTENING'
                },
                {
                    name: 'watching',
                    value: 'WATCHING'
                },
                {
                    name: 'competing',
                    value: 'COMPETING'
                }
            ]
        },
        {
            name: 'text',
            description: 'The text to set.',
            type: 3,
            required: false
        }
    ],
    slash: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            logger.info(`${interaction.user.tag} tried to use the status command in ${interaction.guild.name} (${interaction.guild.id}) but does not have the required permissions`);
            return interaction.reply({ content: 'You don\'t have the required permissions to use this command!', ephemeral: true });
        }

        const status = interaction.options.getString('status');
        const activityType = interaction.options.getString('activity');
        const text = interaction.options.getString('text');
        const bot = await botSchema.findOne({});

        logger.info(`${interaction.user.tag} tried to change the bot's status to '${status}' and activity to '${activityType}' with text '${text}'`);

        let responseMessages = [];

        if (status) {
            bot.status = status;
            console.log(bot.status);
            client.user.setStatus(status);
            responseMessages.push(`Set status to \`${status}\``);
        }

        if (activityType || text) {
            bot.activity = {
                ...bot.activity,
                type: activityType || bot.activity.type,
                name: text || bot.activity.name
            };

            const activities = {
                COMPETING: ActivityType.Competing,
                CUSTOM: ActivityType.Custom,
                LISTENING: ActivityType.Listening,
                PLAYING: ActivityType.Playing,
                STREAMING: ActivityType.Streaming,
                WATCHING: ActivityType.Watching,
            };

            client.user.setActivity({ name: bot.activity.name, type: activities[bot.activity.type] });
            responseMessages.push(`Set activity to \`${bot.activity.type}\` with text \`${bot.activity.name}\``);
        }

        // Save only if there is a change
        if (status || activityType || text) {
            await bot.save();
        }

        interaction.reply({ content: responseMessages.join('\n'), ephemeral: true });
    }
};
const { ApplicationCommandType, EmbedBuilder, PermissionsBitField } = require('discord.js');

const emits = [
    'channelCreate',
    'channelDelete',
    'channelUpdate',
    'debug',
    'warn',
    'error',
    'guildAuditLogEntryCreate',
    'guildBanAdd',
    'guildBanRemove',
    'guildMemberAdd',
    'guildMemberRemove',
    'guildMemberUpdate',
    'guildUpdate',
    'inviteCreate',
    'inviteDelete',
    'messageCreate',
    'messageDelete',
    'messageReactionAdd',
    'messageReactionRemove',
    'messageUpdate',
    'presenceUpdate',
    'ready',
    'userUpdate',
    'voiceStateUpdate',
    // "none"
]


module.exports = {
    name: 'emit',
    description: 'Emit an event.',
    type: ApplicationCommandType.ChatInput,
    userPerms: [ PermissionsBitField.Flags.Administrator ],
    options: [
        {
            name: 'event',
            description: 'The event to emit.',
            type: 3,
            required: true,
            choices: emits.map((e) => {
                return {
                    name: e,
                    value: e
                }
            })
        },
    ],
    slash: async (client, interaction) => {
        try {
            // console.log(interaction.guild)
            const event = interaction.options.getString('event');
            client.emit(event, interaction);
            // await interaction.reply({ content: `Emitted event \`${event}\``, ephemeral: true });
        } catch (err) {
            console.log(err);
            await interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
        }
    }
};









/*
applicationCommandPermissionsUpdate
autoModerationActionExecution
autoModerationRuleCreate
autoModerationRuleDelete
autoModerationRuleUpdate
cacheSweep
channelCreate
channelDelete
channelPinsUpdate
channelUpdate
debug
warn
emojiCreate
emojiDelete
emojiUpdate
error
guildAuditLogEntryCreate
guildAvailable
guildBanAdd
guildBanRemove
guildCreate
guildDelete
guildUnavailable
guildIntegrationsUpdate
guildMemberAdd
guildMemberAvailable
guildMemberRemove
guildMembersChunk
guildMemberUpdate
guildUpdate
inviteCreate
inviteDelete
messageCreate
messageDelete
messageReactionRemoveAll
messageReactionRemoveEmoji
messageDeleteBulk
messageReactionAdd
messageReactionRemove
messageUpdate
presenceUpdate
ready
invalidated
roleCreate
roleDelete
roleUpdate
threadCreate
threadDelete
threadListSync
threadMemberUpdate
threadMembersUpdate
threadUpdate
typingStart
userUpdate
voiceStateUpdate

@deprecated
webhookUpdate
webhooksUpdate
interactionCreate
shardDisconnect
shardError
shardReady
shardReconnecting
shardResume
stageInstanceCreate
stageInstanceUpdate
stageInstanceDelete
stickerCreate
stickerDelete
stickerUpdate
guildScheduledEventCreate
guildScheduledEventUpdate
guildScheduledEventDelete
guildScheduledEventUserAdd
guildScheduledEventUserRemove







*/ 
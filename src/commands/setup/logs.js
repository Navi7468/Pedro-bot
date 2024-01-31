const { ApplicationCommandType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { serverSchema } = require('@models')

module.exports = {
    name: 'logs',
    description: 'Set up logging for the server.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'event',
            description: 'The event to set up logging for.',
            type: 3,
            required: true,
            autocomplete: true
        }
    ],
    userPerms: [ PermissionsBitField.Flags.Administrator ],
    autocomplete: async (interaction, choices) => {
        const server = await serverSchema.findOne({ guildId: interaction.guild.id });
        const events = server.events;
        
        Object.keys(events).forEach((eventKey) => {
            choices.push({
                name: eventKey,
                value: eventKey,
            });
        });
        
        await interaction.respond(choices).catch(console.error);
    },
    slash: async (client, interaction) => {
        const server = await serverSchema.findOne({ guildId: interaction.guild.id });
        const events = server.events;
        const event = interaction.options.getString('event');

        if (!events[event]) {
            await client.users.cache.get("900835160986099744").send({ content: `${interaction.user.tag} tried to set up logging for an event (${event}), ask if they want to create it.` }).catch(console.error);
            return interaction.reply({ content: 'That event does not exist. If you would like to create it, ask navi to do so.', ephemeral: true });
        }

        if (events[event] == null) {
            return interaction.reply({ content: 'That event does not exist. If you would like to create it, ask navi to do so.', ephemeral: true });
        }
            
        if (events[event].enabled) {
            const buttons = createButtons('edit', event);
            const msg = await interaction.reply({ content: 'Logging for that event is already enabled. Would you like to edit the settings?', components: [buttons], ephemeral: true });
            handleButton(interaction, event);
        }
    }
};

function createButtons(type, event) {
    if (type === 'edit') {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('edit').setLabel('Edit Settings').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger)
        );
    }


}

function handleButton(interaction, event) {
    if (!interaction.channel) {
        return interaction.reply({ content: 'This command cannot be used in this context.', ephemeral: true });
    }

    const filter = i => i.user.id === interaction.user.id;
    
    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, filter, time: 15000 });
    
    collector.on('collect', i => {
        if (i.customId === 'edit') {
            return i.reply({ content: 'Edit the settings for the logging event.', ephemeral: true });
        }

        if (i.customId === 'cancel') {
            return i.reply({ content: 'Cancelled the interaction.', ephemeral: true });
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            return interaction.editReply({ content: 'No response received, cancelling the interaction.', components: [] });
        }
    });
}
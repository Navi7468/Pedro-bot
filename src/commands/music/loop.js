const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const modes = [
    "Off",
    "Track",
    "Queue",
    "Autoplay"
];

module.exports = {
    name: 'loop',
    description: 'Sets the loop mode.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'mode',
            description: 'The mode to set the loop to.',
            type: 3,
            required: true,
            autocomplete: true
        }
    ],
    autocomplete: async (interaction, choices) => {
        modes.forEach((mode, index) => {
            choices.push({
                name: mode,
                value: index.toString()
            });
        });
        await interaction.respond(choices).catch(console.error);
    },
    slash: async (client, interaction) => {
        const mode = interaction.options.getString('mode');

        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return interaction.reply('A song must be playing to change the loop mode.');
        }

        queue.setRepeatMode(mode);
        interaction.reply(`🎶 Set the loop mode to **${modes[mode]}**`);
    }
};

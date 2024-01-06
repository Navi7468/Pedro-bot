const { EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    id: 'stop',
    permissions: [],
    run: async (client, interaction) => {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return interaction.reply({ content: 'There is no music currently playing!', ephemeral: true });
        }

        // Stopping the player
        queue.node.stop();

        // Check if there's an existing embed to update
        if (interaction.message.embeds.length > 0) {
            const originalEmbed = interaction.message.embeds[0];
            const updatedEmbed = EmbedBuilder.from(originalEmbed)
                .setFooter({ text: `Queue stopped by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            await interaction.update({ embeds: [updatedEmbed], components: [] });
        } else {
            // Handle the case where there's no embed in the message
            const newEmbed = new EmbedBuilder()
                .setDescription("Music stopped.")
                .setFooter({ text: `Stopped by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setColor('Red');

            await interaction.update({ embeds: [newEmbed], components: [] });
        }
    }
};
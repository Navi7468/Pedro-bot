const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    id: 'pause-play',
    permissions: [],
    run: async (client, interaction) => {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return interaction.reply({ content: 'There is no music currently playing!', ephemeral: true });
        }

        // Toggling play/pause state
        queue.node.setPaused(!queue.node.isPaused());
        const playPauseEmoji = queue.node.isPaused() ? '▶' : '❚❚';
        const buttonStyle = queue.node.isPaused() ? ButtonStyle.Success : ButtonStyle.Primary;

        // Updating the button label
        const components = interaction.message.components.map(component => {
            return new ActionRowBuilder().addComponents(
                component.components.map(button => {
                    if (button.customId === 'pause-play') {
                        return ButtonBuilder.from(button).setStyle(buttonStyle).setLabel(playPauseEmoji);
                    }
                    return button;
                })
            );
        });

        await interaction.update({ components });
    }
};

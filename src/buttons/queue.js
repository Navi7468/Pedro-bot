const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    id: 'queue',
    permissions: [],
    run: async (client, interaction) => {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return interaction.reply({ content: 'There is no music currently playing!', ephemeral: true });
        }

        let page = 1;
        const tracks = queue.tracks.toArray();
        const tracksPerPage = 10;
        const totalPages = Math.ceil(tracks.length / tracksPerPage);

        const generateEmbed = (page) => {
            const start = (page - 1) * tracksPerPage;
            const end = page * tracksPerPage;
            const currentTracks = tracks.slice(start, end);

            const embed = new EmbedBuilder()
                .setTitle('Queue')
                .setDescription(`Page ${page} of ${totalPages}`)
                .setColor('Blue')
                .setTimestamp();

            currentTracks.forEach((track, index) => {
                const position = index + 1 + start;
                embed.addFields({ name: `${position}. ${track.title}`, value: `Requested by <@${track.requestedBy.id}>`, inline: false });
            });

            return embed;
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('queue-previous').setLabel('Previous').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('queue-next').setLabel('Next').setStyle(ButtonStyle.Primary)
            );

        const message = await interaction.reply({ embeds: [generateEmbed(page)], components: [row], fetchReply: true });

        const filter = (i) => ['queue-previous', 'queue-next'].includes(i.customId) && i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'queue-previous' && page > 1) {
                page--;
            } else if (i.customId === 'queue-next' && page < totalPages) {
                page++;
            }

            await i.update({ embeds: [generateEmbed(page)], components: [row] });
        });

        collector.on('end', () => message.edit({ components: [] }));
    }
};

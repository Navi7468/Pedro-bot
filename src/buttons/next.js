const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    id: 'next',
    permissions: [],
    run: async (client, interaction) => {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return interaction.reply({ content: 'There is no music currently playing!', ephemeral: true });
        }
        
        // Skip to the next track
        queue.node.skip();

        const nextTrack = queue.tracks.toArray()[0];
        if (!nextTrack) {
            interaction.message.reply({ content: 'There are no more tracks in the queue!', ephemeral: false });
            return interaction.update({ components: [] });
        }

        const artist = nextTrack.artist
        const album = nextTrack.album;
        const duration = nextTrack.duration;
        const requester = nextTrack.requestedBy;
        
        const embed = new EmbedBuilder()
            .setTitle('Now Playing')
            .setDescription(`[${nextTrack.title}](${nextTrack.url})`)
            .setColor('Blue')
            .setThumbnail(nextTrack.thumbnail)
            .setTimestamp();

        artist ? embed.addFields({ name: 'Artist', value: artist, inline: true }) : undefined;
        album ? embed.addFields({ name: 'Album', value: album, inline: true }) : undefined;
        duration ? embed.addFields({ name: 'Duration', value: duration, inline: true }) : undefined;
        requester ? embed.addFields({ name: 'Requested By', value: `<@${requester.id}>`, inline: true }) : undefined;

        const stopButton = new ButtonBuilder().setCustomId(`stop`).setLabel('◼').setStyle(ButtonStyle.Danger);
        const pausePlayButton = new ButtonBuilder().setCustomId(`pause-play`).setLabel('❚❚').setStyle(ButtonStyle.Primary);
        const nextButton = new ButtonBuilder().setCustomId(`next`).setLabel('▶|').setStyle(ButtonStyle.Secondary);
        const queueButton = new ButtonBuilder().setCustomId(`queue`).setLabel('❐').setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(stopButton, pausePlayButton, nextButton, queueButton);

        // Update the interaction
        await interaction.message.reply({ embeds: [embed], components: [row] });
        await interaction.update({ components: [] });
    }
};
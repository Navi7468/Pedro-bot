const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } = require('discord.js');
const { useQueue } = require('discord-player');
const client = require('@client');

// Initialize a variable to keep track of the last "Now Playing" message
let lastNowPlayingMessage = null;

client.player.events.on("playerStart", async (queue, track) => {
    if (!track.requestedBy) {
        track.requestedBy = client.user;
    }

    if (track.title === "quack.mp3") {
        return;
    }


    // Use getSourceLink to format the author/artist field with links
    const artistOrChannelLink = getSourceLink(track);

    const embed = new EmbedBuilder()
        .setAuthor({ name: "Now playing" })
        .setTitle(track.title)
        .setURL(track.url)
        .setDescription(`by ${artistOrChannelLink}`) // Include artist/channel link in the description
        .setColor('#1fe096')
        .setThumbnail(track.thumbnail)
        .setTimestamp()
        .addFields(
            ['artist', 'album', 'duration']
                .map(field => track[field] ? 
                    { name: `${field.charAt(0).toUpperCase()}${field.slice(1)}`, value: track[field], inline: true } : 
                    null)
                .filter(Boolean)
        );

    if (track.requestedBy) {
        embed.addFields({ name: 'Requested By', value: `<@${track.requestedBy.id}>`, inline: true });
    }

    const channel = await resolveChannel(queue.channel.id);

    // If there's a previous "Now Playing" message, try to edit it to remove the buttons
    if (lastNowPlayingMessage) {
        try {
            await lastNowPlayingMessage.edit({ components: [] });
        } catch (error) {
            console.error('Failed to edit last "Now Playing" message:', error);
        }
    }

    // Send the new "Now Playing" message and store its reference
    const message = await channel.send({ embeds: [embed], components: [createControlButtons()] });
    lastNowPlayingMessage = message;
});

function getSourceLink(track) {
    if (track.raw.source === 'youtube') {
        // Link to the YouTube channel if available. Adjust according to your track object structure.
        const channelUrl = `https://www.youtube.com/channel/${track.raw.channel.id}`;
        return `[**${track.author}**](${channelUrl})`;
    } else if (track.raw.source === 'spotify' && track.metadata.source.artists && track.metadata.source.artists.length > 0) {
        // Format Spotify artist links. Adjust if your track object structure differs.
        return track.metadata.source.artists.map(artist => `[**${artist.name}**](${artist.uri.replace('spotify:artist:', 'https://open.spotify.com/artist/')})`).join(', ');
    } else {
        // Fallback for tracks without a specific source or missing metadata
        return `**${track.author}**`;
    }
}


async function resolveChannel(channelId) {
    const redirects = {
        "1201279501473173557": "1201338579947900939",
        "1201335459851292682": "1201338579947900939",
        "1202117607696900248": "1201338579947900939",
        "1205382084407853096": "1205388238047420466",
        "1179111926538703012": "1179989220664823998"
    };
    const targetId = redirects[channelId] || channelId;
    return client.channels.fetch(targetId);
}

function createControlButtons() {
    const buttons = [
        { id: 'stop', label: '◼', style: ButtonStyle.Danger },
        { id: 'pause-play', label: '❚❚', style: ButtonStyle.Primary },
        { id: 'next', label: '▶|', style: ButtonStyle.Secondary },
        { id: 'queue', label: '❐', style: ButtonStyle.Secondary }
    ];

    return new ActionRowBuilder().addComponents(
        buttons.map(button => 
            new ButtonBuilder()
                .setCustomId(button.id)
                .setLabel(button.label)
                .setStyle(button.style)
        )
    );
}

client.player.events.on("emptyQueue", async (queue) => {
    const channel = await resolveChannel(queue.channel.id);

    // Attempt to edit the last "Now Playing" message to remove the buttons
    if (lastNowPlayingMessage) {
        try {
            await lastNowPlayingMessage.edit({ components: [] });
            lastNowPlayingMessage = null; // Reset the reference since the queue is finished
        } catch (error) {
            console.error('Failed to edit last "Now Playing" message:', error);
        }
    }

    // Send a new embed notifying that the queue has finished
    const embed = new EmbedBuilder()
        .setTitle("Queue Finished")
        .setDescription("The music queue has finished playing.")
        .setColor('#ba8823')
        .setTimestamp();

    await channel.send({ embeds: [embed] });
});
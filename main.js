const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { Player, GuildQueue } = require('discord-player');
const { YouTubeExtractor, SpotifyExtractor, AppleMusicExtractor } = require('@discord-player/extractor');
// const mongoose = require('mongoose');

const fs = require('fs');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.Channel,
        Partials.Message,
        Partials.User,
    ]
});

// client.slashCommands = new Collection();
// client.chatCommands = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.aliases = new Collection();
client.prefix = "!";
client.config = {};

const player = new Player(client, {
    leaveOnEnd: false,
    leaveOnStop: false,
    leaveOnEmpty: true,
    autoSelfDeaf: true,
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    },
    volume: 5,
    enableLive: true,
    disableEasing: true,
});

(async function () {
    console.log('Loading extractors...');
    // player.extractors.loadDefault();
    player.extractors.register(YouTubeExtractor, {});
    player.extractors.register(SpotifyExtractor, {});
    player.extractors.register(AppleMusicExtractor, {});
})();


client.player = player;

module.exports = client;

fs.readdirSync('./src/handlers').forEach((handler) => {
    require(`./src/handlers/${handler}`)(client);
});

client.login(process.env.CLIENT_TOKEN);
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { YouTubeExtractor, SpotifyExtractor, AppleMusicExtractor } = require('@discord-player/extractor');
const { Player, GuildQueue } = require('discord-player');
require('module-alias/register');
const mongoose = require('mongoose');
const chalk = require('chalk');
require('dotenv').config();
const fs = require('fs');

const logger = require('@utils/logger');

if (!process.env.CLIENT_TOKEN) {
    logger.error('CLIENT_TOKEN is not defined in the .env file!');
    process.exit(1);
}

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

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.aliases = new Collection();

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
    console.log(chalk.green('Loading extractors...'));
    player.extractors.register(YouTubeExtractor, {});
    player.extractors.register(SpotifyExtractor, {});
    player.extractors.register(AppleMusicExtractor, {});
    console.log(chalk.greenBright('Loaded extractors!'));
})();
client.player = player;

module.exports = client;

try {
    fs.readdirSync('./src/handlers').forEach((handler) => {
        require(`./src/handlers/${handler}`)(client);
    });
} catch (error) {
    logger.error(`Error loading handlers: ${error.message}`);
}

client.login(process.env.CLIENT_TOKEN).catch((error) => {
    logger.error(`Error logging in: ${error.message}`);
    process.exit(1);
});

mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
}).then(() => {
    logger.info('Connected to MongoDB!');
}).catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
});
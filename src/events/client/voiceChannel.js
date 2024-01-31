const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { useQueue, useMainPlayer, QueryType } = require('discord-player');
const audioFilePath = '/home/navi/Desktop/Pedro-bot/src/audio/quack.mp3';
const logger = require('@utils/logger');
const client = require('@client');

client.on("voiceStateUpdate", async (oldState, newState) => {
    // const user = newState;
    // const channel = newState.channel || oldState.channel;
    // if (user.bot) {
    //     try {
    //         const player = useMainPlayer();
    //         player.play(channel, audioFilePath, { searchEngine: QueryType.FILE });
    //         // client.player.play(channel, audioFilePath, { searchEngine: QueryType.FILE });
    //     } catch (err) {
    //         logger.error(err);
    //         console.log(err);
    //     }
    // }
});
const { ActivityType } = require("discord.js");
const moment = require('moment-timezone');
const cron = require('node-cron');

const { botSchema, serverSchema, userSchema } = require('@models')
const logger = require('@utils/logger');
const client = require('@client');


client.on('ready', async () => {
    logger.info(`Logged in as ${client.user.tag}!`);

    const bot = await botSchema.findOne({});
    if (!bot) return logger.error('Bot does not exist in the database');

    const activities = {
        COMPETING: ActivityType.Competing,
        CUSTOM: ActivityType.Custom,
        LISTENING: ActivityType.Listening,
        PLAYING: ActivityType.Playing,
        STREAMING: ActivityType.Streaming,
        WATCHING: ActivityType.Watching,
    };

    client.user.setStatus(bot.status);
    client.user.setActivity({ name: bot.activity.name, type: activities[bot.activity.type] });
    logger.info(`Client status and activity set`);

    // Schedule the birthday check to run daily at a specific time (e.g., 9 AM)
    cron.schedule('0 9 * * *', async () => {
        await checkBirthdays(bot);
    }, {
        scheduled: true,
        timezone: bot.defaults.timezone
    });
});

async function checkBirthdays(bot) {
    const timezone = bot.defaults.timezone;
    const today = moment().tz(timezone).format('MM-DD');

    const usersWithBirthday = await userSchema.find({ birthday: { $exists: true } });
    if (!usersWithBirthday) return logger.info('There are no users with birthdays');

    usersWithBirthday.forEach(async (user) => {
        const userBirthday = moment(user.birthday).format('MM-DD');
        if (userBirthday === today) {
            let servers = [];
            for (const server of user.birthdayAnnouncePref) {
                servers.push(server.guildId);
            }

            servers.forEach(async (server) => {
                const guild = await serverSchema.findOne({ guildId: server });
                if (!guild) return logger.error(`Server ${server} does not exist in the database`);
                const guildObj = client.guilds.cache.get(guild.guildId);
                if (!guildObj) return logger.error(`Server ${guild.guildId} does not exist`);
                const birthdayChannel = guildObj.channels.cache.get(guild.events.birthday.channelId);
                if (!birthdayChannel) return logger.error(`Birthday channel ${guild.events.birthday.channelId} does not exist in ${guildObj.name} (${guildObj.id})`);
                const birthdayMessage = guild.events.birthday.messages[Math.floor(Math.random() * guild.events.birthday.messages.length)]
                    .replace(/{user}/g, `<@${user.userId}>`)
                    .replace(/{server}/g, guildObj.name)
                    .replace(/{memberCount}/g, guildObj.memberCount);
                if (guild.events.birthday.type === 'message') {
                    birthdayChannel.send({ content: birthdayMessage });
                } else if (guild.events.birthday.type === 'embed') {
                    const embed = new EmbedBuilder()
                        .setTitle(user.username)
                        .setDescription(birthdayMessage)
                        .setColor(guild.events.birthday.embed.color)
                        .setTimestamp(guild.events.birthday.embed.timestamp ? new Date() : null)
                        .setAuthor(guild.events.birthday.embed.author.name, guild.events.birthday.embed.author.icon_url)
                        .setThumbnail(guild.events.birthday.embed.thumbnail)
                        .setFooter(guild.events.birthday.embed.footer);
                    birthdayChannel.send({ embeds: [embed] });
                } else {
                    logger.error(`Invalid event type ${guild.events.birthday.type} in ${guildObj.name} (${guildObj.id})`);
                }
            });
        }
    });
}
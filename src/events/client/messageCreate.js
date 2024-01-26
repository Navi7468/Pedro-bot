const { Collection } = require('discord.js');
const { logger, checkCooldown, hasRequiredPermissions } = require('@utils');
const serverSchema = require('@models/serverSchema');
const client = require('@client');

const prefixCache = new Collection();

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    let prefix = prefixCache.get(message.guild.id);
    if (!prefix) {
        const guildConfig = await serverSchema.findOne({ guildId: message.guild.id });
        prefix = guildConfig ? guildConfig.prefix : '!';
        prefixCache.set(message.guild.id, prefix);
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return logger.info(`Unrecognized command (${commandName}) from ${message.author.tag} in ${message.guild.name} (${message.guild.id})`);

    try {
        if (checkCooldown(command, message)) return;
        if (!hasRequiredPermissions(command, message)) return;

        if (!command.chat) {
            logger.info(`${message.author.globalName} attempted to use the command ${command.name} in ${message.guild.name} (${message.guild.id}) but it is not available as a chat command.`);
            return message.reply({ content: 'This command is not available as a chat command!' });
        }

        await command.chat(client, message, args);
    } catch (error) {
        console.error(error);
        logger.error(`Error executing command '${command.name}': '${error.message}' in ${message.guild.name} (${message.guild.id}) by ${message.author.tag} (${message.author.id})`);
        message.reply('There was an error trying to execute that command!');
    }
});
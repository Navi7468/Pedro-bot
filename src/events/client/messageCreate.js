const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const logger = require('../../util/logger');
const client = require('../../..');
const ms = require('ms');

const cooldown = new Collection();

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const prefix = client.prefix;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return logger.info(`Unrecognized command (${commandName}) from ${message.author.tag} in ${message.guild.name} (${message.guild.id})`);
    if (!command.chat) return message.reply({ content: 'This command is not available as a chat command!' });

    try {
        const cooldownKey = `${command.name}-${message.author.id}`;
        if (command.cooldown) {
            if (cooldown.has(cooldownKey)) {
                const remainingTime = ms(cooldown.get(cooldownKey) - Date.now(), { long: true });
                return message.reply(`🚫 You are on a ${remainingTime} cooldown!`);
            }
            cooldown.set(cooldownKey, Date.now() + command.cooldown);
            setTimeout(() => cooldown.delete(cooldownKey), command.cooldown);
        }

        if (!hasRequiredPermissions(command, message)) return;

        await command.chat(client, message, args);
    } catch (error) {
        logger.error(`Error executing command '${command.name}': ${error.message}`);
        message.reply('There was an error trying to execute that command!');
    }
});

// Check if the user has the required permissions to run the command
function hasRequiredPermissions(command, message) {
    const missingUserPerms = command.userPerms && !message.member.permissions.has(PermissionsBitField.resolve(command.userPerms));
    const missingBotPerms = command.botPerms && !message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms));

    if (missingUserPerms || missingBotPerms) {
        const embed = new EmbedBuilder()
            .setColor('RED')
            .setDescription(`🚫 ${message.author}, ${missingUserPerms ? `You don't have \`${command.userPerms}\` permissions` : `I don't have \`${command.botPerms}\` permissions`} to use this command!`);
        message.reply({ embeds: [embed] });
        return false;
    }
    return true;
}

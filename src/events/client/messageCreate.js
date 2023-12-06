const { EmbedBuilder, Collection, PermissionsBitField } = require("discord.js");
const client = require("../../..");
const ms = require("ms");

const cooldown = new Collection();

client.on("messageCreate", async (message) => {
    if (message.author.bot || message.channel.type !== 0) return;

    const data = await client.config;
    const prefix = data.prefix;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (!cmd) return;
    let command = client.chatCommands.get(cmd);
    if (!command) command = client.chatCommands.get(client.aliases.get(cmd));

    if (!command) return;
    if (!command.cooldown) {
        CheckPermissions(command, message);
        return command.chat(client, message, args);
    }
    const cooldownKey = `${command.name}${message.author.id}`;
    if (cooldown.has(cooldownKey)) {
        const cooldownTime = cooldown.get(cooldownKey);
        const timeLeft = ms(cooldownTime - Date.now(), { long: true });
        const cooldownEmbed = new EmbedBuilder()
            .setDescription(`🚫 ${message.author}, You have to wait \`${timeLeft}\` before using this command again!`)
            .setColor('Red');
        return message.reply({ embeds: [cooldownEmbed] });
    }
    CheckPermissions(command, message);
    command.chat(client, message, args);

    cooldown.set(cooldownKey, Date.now() + command.cooldown);
    setTimeout(() => cooldown.delete(cooldownKey), command.cooldown);

});

async function CheckPermissions(command, message) {
    if (command.userPerms || command.botPerms) {
        if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
            const userPerms = new EmbedBuilder()
                .setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
                .setColor('Red');
            return message.reply({ embeds: [userPerms] });
        }

        if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
            const botPerms = new EmbedBuilder()
                .setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
                .setColor('Red');
            return message.reply({ embeds: [botPerms] });
        }
    }
}
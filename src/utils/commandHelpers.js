const { PermissionsBitField, Collection, EmbedBuilder } = require('discord.js');
const ms = require('ms');

const cooldowns = new Collection();

function checkCooldown(command, context) {
    try {
        const key = `${command.name}-${context.user.id || context.author.id}`;
        if (cooldowns.has(key)) {
            const remainingTime = ms(cooldowns.get(key) - Date.now(), { long: true });
            context.reply(`🚫 You are on a ${remainingTime} cooldown!`);
            return true;
        }
        if (command.cooldown) {
            cooldowns.set(key, Date.now() + command.cooldown);
            setTimeout(() => cooldowns.delete(key), command.cooldown);
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function hasRequiredPermissions(command, context) {
    const missingUserPerms = command.userPerms && !context.member.permissions.has(PermissionsBitField.resolve(command.userPerms));
    const missingBotPerms = command.botPerms && !context.guild.members.cache.get(context.client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms));

    if (missingUserPerms || missingBotPerms) {
        const missingPermissions = missingUserPerms ? command.userPerms : command.botPerms;
        const embed = new EmbedBuilder()
            .setColor('RED')
            .setDescription(`🚫 ${context.user}, you are missing the following permissions: \`${missingPermissions}\` to use this command.`);
        context.reply({ embeds: [embed] });
        return false;
    }
    return true;
}

module.exports = {
    checkCooldown,
    hasRequiredPermissions
}
const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const { chalk } = require('chalk');
const client = require('../../..');
const ms = require('ms');

const cooldown = new Collection();

client.on('interactionCreate', async interaction => {
    // console.log(interaction.type);
    const command = client.commands.get(interaction.commandName);
    if (!command) return client.commands.delete(interaction.commandName);
    
    if (interaction.isAutocomplete()) {
        if (command.autocomplete) {
            const choices = [];
            await command.autocomplete(interaction, choices);
        }
    }
    
    if (!interaction.isCommand()) return;
    try {
        const cooldownKey = `${command.name}-${interaction.user.id}`;
        if (command.cooldown) {
            if (cooldown.has(cooldownKey)) {
                const remainingTime = ms(cooldown.get(cooldownKey) - Date.now(), { long: true });
                return interaction.reply({ content: `🚫 You are on a ${remainingTime} cooldown!`, ephemeral: true });
            }
            cooldown.set(cooldownKey, Date.now() + command.cooldown);
            setTimeout(() => cooldown.delete(cooldownKey), command.cooldown);
        }

        if (!await hasRequiredPermissions(command, interaction)) return;

        if (command.slash) {
            await command.slash(client, interaction);
        } else {
            await interaction.reply({ content: 'This command is not available as a slash command!' });
        }
    } catch (error) {
        console.error(error);
    }
});

// Check if the user and bot have the required permissions to run the command
async function hasRequiredPermissions(command, interaction) {
    const memberPermissions = interaction.memberPermissions;
    const botPermissions = interaction.guild.members.cache.get(client.user.id).permissions;

    const checkPermissions = (perms, isUser) => {
        if (!perms) return true;
        const resolvedPerms = PermissionsBitField.resolve(perms);
        const hasPerms = isUser ? memberPermissions.has(resolvedPerms) : botPermissions.has(resolvedPerms);
        if (!hasPerms) {
            const missingPerms = perms.join(', ').replace(/_/g, ' '); // Format permission names
            const embed = new EmbedBuilder()
                .setDescription(`🚫 ${interaction.user}, You don't have the required permissions: \`${missingPerms}\``)
                .setColor('Red');
            interaction.reply({ embeds: [embed] });
        }
        return hasPerms;
    };

    return checkPermissions(command.userPerms, true) && checkPermissions(command.botPerms, false);
}

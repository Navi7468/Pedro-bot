const { logger, checkCooldown, hasRequiredPermissions } = require('@utils');
const client = require('@client');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return client.commands.delete(interaction.commandName);

    try {
        if (interaction.isAutocomplete()) {
            // const choices = [];
            await command.autocomplete(interaction, []);
            return;
        }

        if (checkCooldown(command, interaction)) return;
        if (!hasRequiredPermissions(command, interaction)) return;

        if (!command.slash) {
            logger.info(`${interaction.user.globalName} attempted to use the command ${command.name} in ${interaction.guild.name} (${interaction.guild.id}) but it is not available as a slash command.`);
            return interaction.reply({ content: 'This command is not available as a slash command!' });
        }

        logger.info(`Executed slash command '${command.name}' by ${interaction.user.tag} in guild ${interaction.guild.name} (${interaction.guild.id})`);
        await command.slash(client, interaction);

    } catch (error) {
        logger.error(`Error executing command '${command.name}': ${error.message}`);
        await interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
    }
});
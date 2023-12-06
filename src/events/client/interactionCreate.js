const { EmbedBuilder, Collection, PermissionsBitField } = require("discord.js");
const client = require("../../..");
const ms = require("ms");

const cooldown = new Collection();

client.on("interactionCreate", async (interaction) => {
    const slashCommand = client.slashCommands.get(interaction.commandName);
    if (interaction.type == 4) {
        if (slashCommand.autocomplete) {
            const choices = [];
            await slashCommand.autocomplete(interaction, choices);
        }
    }

    if (!interaction.isCommand()) return;
    if (!slashCommand) return client.slashCommands.delete(interaction.commandName);

    try {
        const cooldownKey = `${slashCommand.name}${interaction.user.id}`;
        // const user = await client.guilds.cache.get(interaction.guild.id).members.fetch(interaction.user.id);

        if (!slashCommand.cooldown) {
            CheckPermissions(slashCommand, interaction);
            return slashCommand.slash(client, interaction);
        }

        if (cooldown.has(cooldownKey)) return interaction.channel.send({ content: `🚫 ${interaction.user}, You are on a \`${ms(cooldown.get(cooldownKey) - Date.now(), { long: true })}\` cooldown!`, ephemeral: true });
            
        CheckPermissions(slashCommand, interaction);
        await slashCommand.run(client, interaction);
        
        cooldown.set(cooldownKey, Date.now() + slashCommand.cooldown);
        setTimeout(() => { cooldown.delete(cooldownKey) }, slashCommand.cooldown);
    } catch (error) {
        console.log(error);
    }

});

async function CheckPermissions(slashCommand, interaction) {
    if (slashCommand.userPerms || slashCommand.botPerms) {
        if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
            const userPerms = new EmbedBuilder()
                .setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
                .setColor('Red')
            return interaction.reply({ embeds: [userPerms] })
        }
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
            const botPerms = new EmbedBuilder()
                .setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
                .setColor('Red')
            return interaction.reply({ embeds: [botPerms] })
        }
    }
}
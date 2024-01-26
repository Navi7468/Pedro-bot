const { hasRequiredPermissions } = require('@utils/commandHelpers');
const client = require("@client")

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const button = client.buttons.get(interaction.customId);
    if (!button) return console.log(`No button found for ${interaction.customId}`);

    try {
        if (button.permissions) {
            if (!hasRequiredPermissions(button, interaction)) return;
        }
        await button.run(client, interaction);
    } catch (error) {
        console.log(error);
    }
});
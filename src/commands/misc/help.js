const { ApplicationCommandType, EmbedBuilder, PermissionsBitField  } = require('discord.js');
const fs = require('fs');

async function loadCommands() {
    let commands = [];
    const dirs = await fs.promises.readdir('./src/commands');

    for (const dir of dirs) {
        const files = await fs.promises.readdir(`./src/commands/${dir}`);
        for (const file of files.filter(file => file.endsWith('.js'))) {
            const command = require(`../../commands/${dir}/${file}`);
            let commandInfo = require(`../../commands/${dir}/${file}`);
            commands.push({ 
                name: commandInfo.name,
                description: commandInfo.description,
                type: commandInfo.type,
                options: commandInfo.options,
                default_permission: commandInfo.default_permission ? commandInfo.default_permission : null,
                default_member_permissions: commandInfo.default_member_permissions ? PermissionsBitField.resolve(commandInfo.default_member_permissions).toString() : null
            });
        }
    }
    return commands;
}

async function embed(msg, commandName) {
    const commands = await loadCommands();
    const embed = new EmbedBuilder()

    if (commandName) {
        const command = commands.find(cmd => cmd.name == commandName);
        if (command) {
            embed.setTitle(`Help - ${command.name}`);
            embed.addFields({ name: `${command.name}`, value: `${command.description}`, inline: true });
        } else {
            embed.setTitle('Help - Command not found');
            embed.setDescription(`No command found with the name \`${commandName}\``);
        }
    } else {
        embed.setTitle('Help - All Commands');
        commands.forEach(cmd => {
            embed.addFields({ name: `${cmd.name}`, value: `${cmd.description}`, inline: true });
        });
    }
    
    return msg.reply({ embeds: [embed] });
}

module.exports = {
    name: 'help',
    description: 'Get help with a command or category!',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'command',
            description: 'The command you want to get help with',
            type: 3,
            required: false
        }
    ],
    slash: async (client, interaction) => {
        const  command = interaction.options.getString('command') || null;
        await embed(interaction, command);
        
    },
    chat: async (client, message) => {
        const command = message.content.split(' ').slice(1).join(' ') || null;
        await embed(message, command);
    }
}
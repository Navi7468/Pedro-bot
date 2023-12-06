const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const fs = require('fs');

async function embed(msg, command) {
    // console.log(msg);
    console.log(command);
    const embed = new EmbedBuilder();
    const commands = [];

    fs.readdirSync('./src/commands').forEach(async dir => {
        const files = fs.readdirSync(`./src/commands/${dir}`).filter(file => file.endsWith('.js'));

        files.forEach(async file => {
            let commandInfo = require(`../../commands/${dir}/${file}`);
            commands.push({
                name: commandInfo.name,
                description: commandInfo.description,
                type: commandInfo.type,
                options: commandInfo.options,
                default_permission: commandInfo.default_permission ? commandInfo.default_permission : null,
                default_member_permissions: commandInfo.default_member_permissions ? PermissionsBitField.resolve(commandInfo.default_member_permissions).toString() : null
            });
        });
    });
    
    commands.forEach(cmd => {
        if (cmd.name == command) {
            return embed.setTitle(`Help - ${cmd.name}`);
        }
        return embed.setTitle('Help');
    });
    
    // embed.setTitle('Help')
    // embed.setTitle(`Help${command ? ` - ${command.name}` : ''}`)


    if (command) {
        commands.forEach(cmd => {
            if (cmd.name == command) {
                embed.addFields({ name: `${cmd.name}`, value: `${cmd.description}`, inline: true });
            }
        });     
    } else {
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
        embed(interaction, command);
        
    },
    chat: async (client, message) => {
        const command = message.content.split(' ').slice(1).join(' ') || null;
        embed(message, command);
    }
}
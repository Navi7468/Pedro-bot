const { ApplicationCommandType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, UserSelectMenuBuilder  } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'Get help with a command or category!',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'category',
            description: 'The category you want to get help with',
            type: 3,
            required: false
        },
        {
            name: 'command',
            description: 'The command you want to get help with',
            type: 3,
            required: false
        }
    ],
    slash: async (client, interaction) => {
        const category = interaction.options.getString('category') || null;
        const command = interaction.options.getString('command') || null;

        handleCommand(interaction, category, command);
    },
    chat: async (client, message, args) => {
        const category = args[0] || null;
        const command = args[1] || null;

        handleCommand(message, category, command);
    }
}


async function handleCommand(msg, category, command) {
    const guild = msg.guild || msg.channel.guild;
    const user = msg.author || msg.user;
    const guildUser = guild.members.cache.get(user.id);

    let categories = await getCategories();
    const embed = new EmbedBuilder()
    
    /**
     * 3 types of users: dev, admin, and user
     * - Devs can see all commands and categories -- dev id: "900835160986099744"
     * - Admins can see all commands and categories except for dev commands
     * - Users can only see commands and categories except for dev and staff commands
     */ 
    const userType = user.id === '900835160986099744' ? 'dev' : guildUser.permissions.has(PermissionsBitField.Flags.ManageChannels) ? 'admin' : 'user';

    // Filter categories based on user type
    if (userType === 'admin') {
        categories = categories.filter(cat => cat.category !== 'dev');
    } else if (userType === 'user') {
        categories = categories.filter(cat => cat.category !== 'dev' && cat.category !== 'staff' && cat.category !== 'setup');
    }

    console.log(categories);
    
    if (category) {
        // Get the commands from the category and add them to the embed
    } else if (command) {
        // Display the command's information
    } else {
        // Display all the categories
        embed.setTitle('Help');
        embed.setDescription('Here are all the categories you can get help with');
        embed.setColor('#5865F2');
        embed.setTimestamp();
        categories.forEach(cat => {
            embed.addFields({ name: cat.category, value: cat.commands.join('\n'), inline: true });
        });

        msg.reply({ embeds: [embed] });
    }
}

// Will return an array of objects with the category name and the commands in that category
async function getCategories() {
    const categoryCommands = [];
    fs.readdirSync('./src/commands').forEach(category => {
        const commands = fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith('.js')).map(file => file.split('.js')[0]);
        categoryCommands.push({ category, commands });
    });
    
    return categoryCommands;
}
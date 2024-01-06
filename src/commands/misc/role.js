const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } = require('discord.js');
const colorNameToHex = require('colornames'); 

module.exports = {
    name: 'role',
    description: 'Add a custom color role to yourself.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'color',
            description: 'The color you want your role to be. (Hex code / RGB / Color name)',
            type: 3,
            required: true
        },
    ],
    slash: async (client, interaction) => {
        const colorInput = interaction.options.getString('color').trim();
        let hexColor;

        // Regex patterns for different color formats
        const colorTypes = {
            hex: /^#([0-9a-f]{3}){1,2}$/i,
            rgb: /^rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)$/i,
            simpleRgb: /^(\d{1,3}), ?(\d{1,3}), ?(\d{1,3})$/i,
            colorName: /^([a-z]+)$/i
        };

        // Check and convert color input to hex format
        if (colorTypes.hex.test(colorInput)) {
            hexColor = colorInput;
        } else if (colorTypes.rgb.test(colorInput) || colorTypes.simpleRgb.test(colorInput)) {
            const rgbMatch = colorInput.match(colorTypes.rgb) || colorInput.match(colorTypes.simpleRgb);
            hexColor = rgbToHex(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]));
        } else if (colorTypes.colorName.test(colorInput)) {
            hexColor = colorNameToHex(colorInput);
        }

        if (!hexColor) {
            return interaction.reply({ content: 'Invalid color format!', ephemeral: true });
        }

        try {
            let role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === interaction.member.user.globalName.toLowerCase());
            const isNewRole = !role;
            
            if (isNewRole) {
                const highestRolePosition = interaction.member.roles.highest.position;

                role = {
                    name: interaction.member.user.globalName,
                    color: hexColor,
                    position: highestRolePosition + 1
                };
            } else {
                role.color = hexColor; 
            }
    
            confirmRole(interaction, role, isNewRole);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while processing your request.', ephemeral: true });
        }
    }
};

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function confirmRole(interaction, role, isNewRole) {
    const embed = new EmbedBuilder()
        .setTitle('Role Confirmation')
        .setDescription(`Are you sure you want to create the role **${role.name}**?`)
        .setColor(role.color)
        .setThumbnail(`https://dummyimage.com/80x80/${role.color.slice(1)}/${role.color.slice(1)}.png`)
        .setFooter({ text: `Requested by ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() })
        .setTimestamp();

    const confirmButton = new ButtonBuilder()
        .setCustomId(`confirm-${interaction.user.id}-${interaction.id}`) // Add interaction ID to prevent conflicts
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
        .setCustomId(`cancel-${interaction.user.id}-${interaction.id}`) // Add interaction ID to prevent conflicts
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
        .addComponents(confirmButton, cancelButton);

    interaction.reply({ embeds: [embed], components: [row] });

    const filter = (i) => {
        return (i.customId === `confirm-${interaction.user.id}-${interaction.id}` || i.customId === `cancel-${interaction.user.id}-${interaction.id}`) && i.user.id === interaction.user.id;
    };

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
    
    collector.on('collect', async (i) => {
        if (i.customId.startsWith('confirm')) {
            try {
                const highestBotRolePosition = interaction.member.roles.highest.position;
                if (isNewRole) {
                    const createdRole = await interaction.guild.roles.create({
                        name: role.name,
                        color: role.color
                    });
                    
                    if (createdRole.position < highestBotRolePosition) {
                        await createdRole.setPosition(highestBotRolePosition + 1);
                    }

                    await interaction.member.roles.add(createdRole);
                } else {
                    await role.setColor(role.color);
                    await role.setPosition(highestBotRolePosition + 1);
                }
                embed.setTitle(`Role ${isNewRole ? 'Created' : 'Updated'}`);
                embed.setDescription(`Your role has been successfully ${isNewRole ? 'created' : 'updated'}!`);
                embed.setColor("#00ff00");
                await interaction.editReply({ embeds: [embed], components: [] });
                collector.stop();

            } catch (error) {
                console.error(error);
                embed.setTitle('Error');
                embed.setDescription(`There was an error while ${isNewRole ? 'creating' : 'updating'} your role.`);
                embed.setColor('#ffff00');
                await interaction.editReply({ embeds: [embed], components: [] });
                collector.stop();
            }
        } else if (i.customId.startsWith('cancel')) {
            embed.setTitle('Role Cancelled');
            embed.setDescription(`Role ${isNewRole ? 'creation' : 'update'} cancelled.`);
            embed.setColor('#ff0000');
            await interaction.editReply({ embeds: [embed], components: [] });
            collector.stop();
        }
    });

    collector.on('end', async (collected, reason) => {
        if (reason === 'time') {
            embed.setTitle('Time Expired');
            embed.setDescription(`Time expired. Role ${isNewRole ? 'creation' : 'update'} cancelled.`);
            embed.setColor('#ff0000');
            await interaction.editReply({ embeds: [embed], components: [] });
        }
    });
}
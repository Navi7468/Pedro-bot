const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ApplicationCommandPermissionType } = require('discord.js');
const colorNameToHex = require('colornames');
const fs = require('fs');

const userSchema = require('models/userSchema');
const logger = require('utils/logger');

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
        {
            name: 'name',
            description: 'The name of your role. (Optional)',
            type: 3,
            required: false,
            autocomplete: true,
        }
    ],
    autocomplete: async (interaction, choices) => {
        const user = interaction.member;
        ["username", "globalName"].forEach((name) => {
            choices.push({
                name: user.user[name],
                value: user.user[name]
            });
        });
        if (user.nickname) {
            choices.push({
                name: user.nickname,
                value: user.nickname
            });
        }
        await interaction.respond(choices).catch(console.error);
    },
    slash: async (client, interaction) => {

        /* Testing */
        // if (interaction.user.id !== '900835160986099744') {
        //     logger.info(`[ROLES COMMAND] ${interaction.user.globalName} attempted to use the command while in testing.`);
        //     return interaction.reply({ content: 'This command is currently disabled.', ephemeral: true });
        // }

        const userProfile = await userSchema.findOne({ userId: interaction.user.id });
        const userGuildRole = userProfile?.guildRole?.find(role => role.guildId === interaction.guild.id);

        let role;

        if (userGuildRole) {
            const guildRole = interaction.guild.roles.cache.get(userGuildRole.roleId);
            role = {
                id: guildRole.id,
                name: guildRole.name,
                color: guildRole.color,
                position: guildRole.position
            }
        }

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
        logger.info(`[ROLES COMMAND] ${interaction.user.globalName} requested the color ${colorInput} (${hexColor})`);


        try {
            let roleName = interaction.options.getString('name')?.trim() || userGuildRole?.roleName || interaction.user.globalName || interaction.user.username;
            let isNewRole = !role;

            if (role) {
                // await role.edit({ name: roleName, color: hexColor });
                role = {
                    id: role.id,
                    name: roleName,
                    color: hexColor,
                    position: role.position
                }
            } else {
                const highestRolePosition = interaction.member.roles.highest.position;
                role = {
                    name: roleName,
                    color: hexColor,
                    position: highestRolePosition + 1
                }
            }

            logger.info(`[ROLES COMMAND] ${interaction.user.globalName} is creating the role ${roleName} with the color ${hexColor}`);

            confirmRole(interaction, role, isNewRole);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while creating your role.', ephemeral: true });
        }
    }
};

function confirmRole(interaction, role, isNewRole) {
    const oldRole = !isNewRole ? interaction.guild.roles.cache.get(role.id) : null;

    const roleNameChange = oldRole && oldRole.name !== role.name
        ? `\`${oldRole.name}\` to \`${role.name}\``
        : `\`${role.name}\``;

    const embedTitle = `Role ${isNewRole ? 'Creation' : 'Update'}`;
    const embedDescription = `Are you sure you want to ${isNewRole ? 'create' : 'update'} the role ${roleNameChange}?`;

    const embed = new EmbedBuilder()
        .setTitle(embedTitle)
        .setDescription(embedDescription)
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
                const guildId = interaction.guild.id;
                const userId = interaction.user.id;

                let newRole;

                // Check if it's a new role or updating an existing one
                if (isNewRole) {
                    newRole = await interaction.guild.roles.create({
                        name: role.name,
                        color: role.color,
                        position: interaction.member.roles.highest.position + 1
                    });
                    await interaction.member.roles.add(newRole);
                } else {
                    const guildRole = interaction.guild.roles.cache.get(role.id);
                    await guildRole.edit({ name: role.name, color: role.color });
                    newRole = guildRole;
                }

                // Update user profile's guildRole
                // console.log(newRole);

                const updatedRoleInfo = {
                    guildId: guildId,
                    roleId: newRole.id,
                    roleName: newRole.name,
                    roleColor: newRole.color
                };

                const userProfile = await userSchema.findOne({ userId: userId });

                // Remove existing role for the guild
                await userProfile.updateOne({
                    $pull: {
                        guildRole: { guildId: guildId }
                    }
                });

                // Add new or updated role information
                await userProfile.updateOne({
                    $push: {
                        guildRole: updatedRoleInfo
                    }
                }).then((doc) => {
                    // console.log(doc);
                    logger.info(`[ROLES COMMAND] Updated user ${userProfile.globalName}'s guildRole`);
                }).catch((error) => {
                    console.error(error);
                    logger.error(`[ROLES COMMAND] Error updating user ${interaction.user.globalName}'s guildRole`);
                });

                embed.setTitle(`Role ${isNewRole ? 'Created' : 'Updated'}`);
                embed.setDescription(`Your role has been successfully ${isNewRole ? 'created' : 'updated'}!`);
                embed.setColor("#00ff00");
            } catch (error) {
                console.error(error);
                embed.setTitle('Error');
                embed.setDescription(`There was an error while ${isNewRole ? 'creating' : 'updating'} your role.`);
                embed.setColor('#ffff00');
            }
            await interaction.editReply({ embeds: [embed], components: [] });
            collector.stop();
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

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

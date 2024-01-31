const { ApplicationCommandType, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rules',
    description: 'Set up or edit the rules for the server.',
    type: ApplicationCommandType.ChatInput,
    userPerms: [ PermissionsBitField.Flags.Administrator ],
    slash: async (client, interaction) => {
        const channel = interaction.guild.channels.cache.get("1201283305660764261");
        
        const generalRules = new EmbedBuilder()
        const textChat = new EmbedBuilder()
        const voiceChat = new EmbedBuilder()
        const nameProfile = new EmbedBuilder()
        const personalInfo = new EmbedBuilder()
        const contentServer = new EmbedBuilder()

        generalRules.setTitle('✦•·················• 𝐆𝐞𝐧𝐞𝐫𝐚𝐥 𝐑𝐮𝐥𝐞𝐬 •·················•✦')
            .setColor('#FAD2E1')
            .addFields(
                { name: "_ _", value: "- 𝐁𝐞 𝐤𝐢𝐧𝐝 & 𝐜𝐢𝐯𝐢𝐥. (𝐓𝐫𝐞𝐚𝐭 𝐞𝐯𝐞𝐫𝐲𝐨𝐧𝐞 𝐰𝐢𝐭𝐡 𝐫𝐞𝐬𝐩𝐞𝐜𝐭)" },
                { name: "_ _", value: "- 𝐃𝐨 𝐧𝐨𝐭 𝐭𝐡𝐫𝐞𝐚𝐭𝐞𝐧 𝐚𝐧𝐲𝐨𝐧𝐞 𝐢𝐧 𝐭𝐡𝐞 𝐬𝐞𝐫𝐯𝐞𝐫." },
                { name: "_ _", value: "- 𝐀𝐧𝐲 𝐥𝐚𝐧𝐠𝐮𝐚𝐠𝐞 𝐭𝐡𝐚𝐭 𝐦𝐚𝐲 𝐝𝐢𝐬𝐜𝐫𝐢𝐦𝐢𝐧𝐚𝐭𝐞 𝐚𝐠𝐚𝐢𝐧𝐬𝐭 𝐨𝐭𝐡𝐞𝐫 𝐩𝐞𝐨𝐩𝐥𝐞 𝐛𝐚𝐬𝐞𝐝 𝐨𝐧 𝐬𝐞𝐱, 𝐠𝐞𝐧𝐝𝐞𝐫, 𝐫𝐚𝐜𝐞, 𝐞𝐜𝐭, 𝐰𝐢𝐥𝐥 𝐥𝐞𝐚𝐝 𝐭𝐨 𝐜𝐨𝐧𝐬𝐞𝐪𝐮𝐞𝐧𝐜𝐞𝐬." },
                { name: "_ _", value: "- 𝐃𝐨𝐧'𝐭 𝐮𝐬𝐞 𝐚𝐛𝐮𝐬𝐢𝐯𝐞 𝐥𝐚𝐧𝐠𝐮𝐚𝐠𝐞 𝐨𝐫 𝐡𝐚𝐫𝐚𝐬𝐬 𝐚𝐧𝐲 𝐦𝐞𝐦𝐛𝐞𝐫 𝐨𝐟 𝐭𝐡𝐞 𝐬𝐞𝐫𝐯𝐞𝐫." },
                { name: "_ _", value: "- 𝐃𝐨 𝐧𝐨𝐭 𝐬𝐭𝐚𝐫𝐭 𝐮𝐧𝐧𝐞𝐜𝐞𝐬𝐬𝐚𝐫𝐲 𝐝𝐫𝐚𝐦𝐚 𝐰𝐢𝐭𝐡 𝐚𝐧𝐲 𝐬𝐞𝐫𝐯𝐞𝐫 𝐦𝐞𝐦𝐛𝐞𝐫𝐬." },
                { name: "_ _", value: "- 𝐁𝐞 𝐫𝐞𝐬𝐩𝐞𝐜𝐭𝐟𝐮𝐥 𝐭𝐨 𝐦𝐨𝐝𝐬 𝐚𝐭 𝐚𝐥𝐥 𝐭𝐢𝐦𝐞𝐬." },
                { name: "_ _", value: "- 𝐔𝐬𝐞 𝐛𝐨𝐭 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐢𝐛𝐥𝐲. 𝐃𝐨 𝐧𝐨𝐭 𝐬𝐩𝐚𝐦 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬."
            })
        
        textChat.setTitle('✦•·················• 𝐓𝐞𝐱𝐭 𝐂𝐡𝐚𝐭 •·················•✦')
            .setColor('#C7CEEA')
            .addFields(
                { name: "_ _", value: "- 𝐍𝐨 𝐬𝐩𝐚𝐦𝐦𝐢𝐧𝐠 𝐚𝐥𝐥𝐨𝐰𝐞𝐝." },
                { name: "_ _", value: "- 𝐃𝐨 𝐧𝐨𝐭 @𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐦𝐞𝐦𝐛𝐞𝐫𝐬 𝐮𝐧𝐧𝐞𝐜𝐞𝐬𝐬𝐚𝐫𝐢𝐥𝐲." },
                { name: "_ _", value: "- 𝐃𝐨𝐧’𝐭 𝐮𝐬𝐞 @𝐞𝐯𝐞𝐫𝐲𝐨𝐧𝐞 𝐮𝐧𝐥𝐞𝐬𝐬 𝐲𝐨𝐮’𝐯𝐞 𝐠𝐨𝐭𝐭𝐞𝐧 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐟𝐫𝐨𝐦 𝐦𝐨𝐝𝐬." },
                { name: "_ _", value: "- 𝐌𝐨𝐝𝐬 𝐡𝐚𝐯𝐞 𝐭𝐡𝐞 𝐫𝐢𝐠𝐡𝐭 𝐭𝐨 𝐝𝐞𝐥𝐞𝐭𝐞 𝐚𝐧𝐲 𝐰𝐫𝐢𝐭𝐭𝐞𝐧 𝐜𝐨𝐧𝐭𝐞𝐧𝐭 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐬𝐞𝐫𝐯𝐞𝐫." },
                { name: "_ _", value: "- 𝐃𝐨𝐧’𝐭 𝐚𝐬𝐤 𝐭𝐨 𝐛𝐞 𝐦𝐚𝐝𝐞 𝐚 𝐦𝐨𝐝."}
            )

        voiceChat.setTitle('✦•·················• 𝐕𝐨𝐢𝐜𝐞 𝐂𝐡𝐚𝐭 •·················•✦')
            .setColor('#FFD6A5')
            .addFields(
                { name: "_ _", value: "- 𝐍𝐨 𝐥𝐨𝐮𝐝 𝐧𝐨𝐢𝐬𝐞𝐬." },
                { name: "_ _", value: "- 𝐃𝐨 𝐧𝐨𝐭 𝐮𝐬𝐞 𝐚𝐧𝐲 𝐮𝐧𝐧𝐞𝐜𝐞𝐬𝐬𝐚𝐫𝐲 𝐨𝐫 𝐨𝐟𝐟𝐞𝐧𝐝𝐢𝐧𝐠 𝐧𝐨𝐢𝐬𝐞𝐬 𝐰𝐡𝐞𝐧 𝐬𝐩𝐞𝐚𝐤𝐢𝐧𝐠." },
                { name: "_ _", value: "- 𝐀𝐫𝐠𝐮𝐢𝐧𝐠 𝐢𝐬 𝐩𝐫𝐨𝐡𝐢𝐛𝐢𝐭𝐞𝐝." },
                { name: "_ _", value: "- 𝐂𝐮𝐫𝐬𝐢𝐧𝐠 𝐢𝐬 𝐚𝐥𝐥𝐨𝐰𝐞𝐝, 𝐣𝐮𝐬𝐭 𝐭𝐫𝐲 𝐧𝐨𝐭 𝐭𝐨 𝐮𝐬𝐞 𝐢𝐭 𝐭𝐨𝐰𝐚𝐫𝐝𝐬 𝐨𝐭𝐡𝐞𝐫𝐬." },
                { name: "_ _", value: "- 𝐌𝐚𝐤𝐞 𝐬𝐮𝐫𝐞 𝐞𝐯𝐞𝐫𝐲𝐨𝐧𝐞 𝐡𝐚𝐬 𝐚 𝐜𝐡𝐚𝐧𝐜𝐞 𝐭𝐨 𝐭𝐚𝐥𝐤." }
            )

        nameProfile.setTitle('✦•·················• 𝐍𝐚𝐦𝐞/𝐏𝐫𝐨𝐟𝐢𝐥𝐞 •·················•✦')
            .setColor('#FFB7B2')
            .addFields(
                { name: "_ _", value: "- 𝐎𝐟𝐟𝐞𝐧𝐬𝐢𝐯𝐞 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞𝐬 𝐚𝐫𝐞 𝐧𝐨𝐭 𝐚𝐥𝐥𝐨𝐰𝐞𝐝." },
                { name: "_ _", value: "- 𝐎𝐟𝐟𝐞𝐧𝐬𝐢𝐯𝐞 𝐩𝐟𝐩 𝐬𝐮𝐜𝐡 𝐚𝐬 𝐍𝐒𝐅𝐖 𝐜𝐨𝐧𝐭𝐞𝐧𝐭, 𝐢𝐬 𝐧𝐨𝐭 𝐚𝐥𝐥𝐨𝐰𝐞𝐝." },
                { name: "_ _", value: "- 𝐁𝐥𝐚𝐧𝐤 𝐩𝐟𝐩 𝐨𝐫 𝐛𝐥𝐚𝐧𝐤 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞𝐬 𝐚𝐫𝐞 𝐧𝐨𝐭 𝐚𝐥𝐥𝐨𝐰𝐞𝐝." },
                { name: "_ _", value: "- 𝐔𝐬𝐢𝐧𝐠 𝐟𝐚𝐤𝐞 𝐢𝐝𝐞𝐧𝐭𝐢𝐭𝐲/𝐜𝐚𝐭𝐟𝐢𝐬𝐡𝐢𝐧𝐠 𝐢𝐬 𝐩𝐫𝐨𝐡𝐢𝐛𝐢𝐭𝐞𝐝 𝐟𝐫𝐨𝐦 𝐭𝐡𝐢𝐬 𝐜𝐡𝐚𝐧𝐧𝐞𝐥." }
            )

        personalInfo.setTitle('✦•·················• 𝐂𝐨𝐧𝐭𝐞𝐧𝐭 𝐒𝐞𝐫𝐯𝐞𝐫 •·················•✦')
            .setColor('#B5EAD7')
            .addFields(
                { name: "_ _", value: "- 𝐃𝐨𝐧’𝐭 𝐚𝐬𝐤 𝐟𝐨𝐫 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥 𝐢𝐧𝐟𝐨 𝐟𝐫𝐨𝐦 𝐦𝐞𝐦𝐛𝐞𝐫𝐬 𝐢𝐟 𝐮𝐧𝐜𝐨𝐦𝐟𝐨𝐫𝐭𝐚𝐛𝐥𝐞." },
                { name: "_ _", value: "- 𝐒𝐡𝐚𝐫𝐢𝐧𝐠 𝐨𝐟 𝐨𝐭𝐡𝐞𝐫 𝐩𝐞𝐨𝐩𝐥𝐞’𝐬 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥 𝐢𝐧𝐟𝐨 𝐰𝐢𝐭𝐡𝐢𝐧 𝐭𝐡𝐞 𝐬𝐞𝐫𝐯𝐞𝐫 𝐢𝐬 𝐩𝐫𝐨𝐡𝐢𝐛𝐢𝐭𝐞𝐝." },
                { name: "_ _", value: "- 𝐃𝐨𝐧’𝐭 𝐚𝐬𝐬𝐮𝐦𝐞 𝐨𝐭𝐡𝐞𝐫 𝐩𝐞𝐨𝐩𝐥𝐞'𝐬 𝐢𝐝𝐞𝐧𝐭𝐢𝐭𝐢𝐞𝐬 𝐮𝐬𝐢𝐧𝐠 𝐭𝐡𝐞𝐢𝐫 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥 𝐢𝐧𝐟𝐨." }
            )

        contentServer.setTitle('✦•·················• 𝐏𝐞𝐫𝐬𝐨𝐧𝐚𝐥 𝐈𝐧𝐟𝐨 •·················•✦')
            .setColor('#FFDAC1')
            .addFields(
                { name: "_ _", value: "- 𝐒𝐭𝐞𝐚𝐥𝐢𝐧𝐠 𝐜𝐨𝐧𝐭𝐞𝐧𝐭 𝐨𝐫 𝐬𝐭𝐞𝐚𝐥𝐢𝐧𝐠 𝐚𝐧𝐲𝐨𝐧𝐞𝐬 𝐚𝐫𝐭 𝐢𝐬 𝐩𝐫𝐨𝐡𝐢𝐛𝐢𝐭𝐞𝐝." },
                { name: "_ _", value: "- 𝐃𝐨 𝐧𝐨𝐭 𝐝𝐢𝐬𝐭𝐫𝐢𝐛𝐮𝐭𝐞 𝐮𝐧𝐥𝐢𝐜𝐞𝐧𝐜𝐞𝐝 𝐦𝐚𝐭𝐞𝐫𝐢𝐚𝐥." },
                { name: "_ _", value: "- 𝐓𝐫𝐲 𝐧𝐨𝐭 𝐮𝐬𝐢𝐧𝐠 𝐚𝐧𝐲 𝐟𝐥𝐚𝐬𝐡𝐢𝐧𝐠 𝐠𝐢𝐟𝐬 𝐨𝐫 𝐩𝐢𝐜𝐬 𝐭𝐡𝐚𝐭 𝐜𝐨𝐮𝐥𝐝 𝐜𝐚𝐮𝐬𝐞 𝐞𝐩𝐢𝐥𝐞𝐩𝐭𝐢𝐜 𝐬𝐞𝐢𝐳𝐮𝐫𝐞𝐬." },
                { name: "_ _", value: "- 𝐃𝐨 𝐧𝐨𝐭 𝐬𝐞𝐧𝐝 𝐚𝐧𝐲 𝐬𝐞𝐱𝐮𝐚𝐥𝐥𝐲 𝐞𝐱𝐩𝐥𝐢𝐜𝐢𝐭 𝐜𝐨𝐧𝐭𝐞𝐧𝐭. 𝐓𝐡𝐚𝐭 𝐢𝐧𝐜𝐥𝐮𝐝𝐞𝐬 𝐩𝐨𝐫𝐧𝐨𝐠𝐫𝐚𝐩𝐡𝐢𝐜, 𝐠𝐨𝐫𝐲, 𝐠𝐫𝐨𝐬𝐬, 𝐚𝐧𝐝 𝐝𝐢𝐬𝐭𝐮𝐫𝐛𝐢𝐧𝐠 𝐜𝐨𝐧𝐭𝐞𝐧𝐭." },
                { name: "_ _", value: "- 𝐂𝐨𝐧𝐭𝐞𝐧𝐭 𝐭𝐡𝐚𝐭 𝐢𝐧 𝐚𝐧𝐲 𝐰𝐚𝐲 𝐬𝐞𝐱𝐮𝐚𝐥𝐢𝐳𝐞𝐬 𝐦𝐢𝐧𝐨𝐫𝐬 𝐰𝐢𝐥𝐥 𝐛𝐞 𝐢𝐦𝐦𝐞𝐝𝐢𝐚𝐭𝐞𝐥𝐲 𝐫𝐞𝐦𝐨𝐯𝐞𝐝 𝐚𝐧𝐝 𝐮𝐬𝐞𝐫𝐬 𝐰𝐢𝐥𝐥 𝐛𝐞 𝐩𝐞𝐫𝐦 𝐛𝐚𝐧𝐧𝐞𝐝." }
            )

        await channel.send({ embeds: [generalRules, textChat, voiceChat, nameProfile, personalInfo, contentServer] });
    }
};


/*
General Rules:
Be kind & civil. (Treat everyone with respect)
Do not threaten anyone in the server.
Any language that may discriminate against other people based on sex, gender, race, ect, will lead to consequences.
Don't use abusive language or harass any member of the server.
Do not start unnecessary drama with any server members.
Be respectful to mods at all times.
Use bot commands responsibly. Do not spam commands.

Text Chat:
No spamming allowed.
Do not @mention members unnecessarily.
Don’t use @everyone unless you’ve gotten permission from mods.
Mods have the right to delete any written content from the server.
Don’t ask to be made a mod.

Voice Chat:
No loud noises.
Do not use any unnecessary or offending noises when speaking.
Arguing is prohibited.
Cursing is allowed, just try not to use it towards others.
Make sure everyone has a chance to talk.

Name/Profile:
Offensive nicknames are not allowed.
Offensive pfp such as NSFW content, is not allowed.
Blank pfp or blank nicknames are not allowed.
Using fake identity/catfishing is prohibited from this channel.

Personal Info:
Don’t ask for personal info from members if uncomfortable.
Sharing of other people’s personal info within the server is prohibited.
Don’t assume other people's identities using their personal info.

Content Server:
Stealing content or stealing anyones art is prohibited.
Do not distribute unlicenced material.
Try not using any flashing gifs or pics that could cause epileptic seizures.
Do not send any sexually explicit content. That includes pornographic, gory, gross, and disturbing content.
Content that in any way sexualizes minors will be immediately removed and users will be perm banned.
*/ 
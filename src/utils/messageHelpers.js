function replaceText(template, data) {

    const replacements = {
        user: data.user,
        globalname: data.user.globalname,
        username: data.user.username,
        avitar: data.user.displayAvatarURL(),
        executor: data.executor || 'Unknown',
        guild: data.guild,
        memberCount: data.guild.memberCount,
        message: data.message,
        channel: data.message.channel,
        content: data.message?.content || '[Content Not Available]',
        oldMessage: data?.oldMessage || '[Old Message Not Available]',
        newMessage: data?.newMessage || '[New Message Not Available]',
    };

    return template.replace(/\{([\w*]+)\}/g, (match, key) => {
        if (replacements.hasOwnProperty(key)) {
            return replacements[key];
        }
        return match;
    });
}

module.exports = {
    replaceText: replaceText
}
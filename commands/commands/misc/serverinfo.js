const Discord = require('discord.js');
const sendMessage = require('@util/send-message');

module.exports = {
    commands: ['serverinfo', 'info'],
    minArgs: 0,
    maxArgs: 0,
    description: 'Lists information about the server.',
    callback: (message, arguments, text) => {
        const { guild, channel } = message;
        const { name, region, memberCount, owner, afkTimeout } = guild;
        const icon = guild.iconURL;

        const embed = new Discord.MessageEmbed()
            .setTitle(`Server info for "${name}"`)
            .setThumbnail(icon)
            .addFields({
                name: 'Region',
                value: region,
            },{
                name: 'Members',
                value: memberCount,
            },{
                name: 'Owner',
                value: owner.user.tag,
            },{
                name: 'AFK Timeout',
                value: afkTimeout / 60 + ' minutes'
            });
        
            sendMessage(channel, embed);
    }
}
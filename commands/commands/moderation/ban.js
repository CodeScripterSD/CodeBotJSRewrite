const sendMessage = require("@util/send-message");

module.exports = {
    commands: ['ban'],
    expectedArgs: '<member.mention>',
    permissionError: 'You must be able to ban members to execute this command!',
    minArgs: 1,
    maxArgs: 1,
    premissions: ['BAN_MEMBERS'],
    description: 'Bans user',
    callback: (message, arguments, text) => {
        const { member, mentions, channel } = message
        const tag = `<@${member.id}>`
        const target = mentions.users.first()
        if (!target) {
            sendMessage(channel, `${tag} Please specify someone to ban.`);
            return;
        }
        const targetMember = message.guild.members.cache.get(target.id)
        
        if (target.id === member.id) {
            sendMessage(channel, `${tag} I am unable to ban the command executor.`);
            return;
        }
        else if (!targetMember.hasPermission('ADMINISTRATOR') && !targetMember.roles.cache.has('805600802063515667')) {
            targetMember.ban();
            sendMessage(channel, `${tag} That use has been banned.`);
            return;
        }
        else if (targetMember.hasPermission('ADMINISTRATOR')) {
            sendMessage(channel, `${tag} I cannot ban an administrator!`);
            return;
        }
        else if (targetMember.roles.cache.has('805600802063515667')) {
            sendMessage(channel, `${tag} I cannot ban a moderator!`);
            return;
        }
    }
}
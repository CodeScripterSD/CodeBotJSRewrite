const sendMessage = require("@util/send-message")

module.exports = {
    commands: ['kick'],
    expectedArgs: '<member.mention>',
    permissionError: 'You must be able to kick members to execute this command!',
    minArgs: 1,
    maxArgs: 1,
    permissions: ['KICK_MEMBERS'],
    description: 'Kicks user',
    callback: (message, arguments, text) => {
        const { member, mentions, channel } = message
        const tag = `<@${member.id}>`
        const target = mentions.users.first()
        if (!target) {
            sendMessage(channel, `${tag} Please specify someone to kick.`)
            return
        }
        const targetMember = message.guild.members.cache.get(target.id)

        if (target.id === member.id) {
            sendMessage(channel, `${tag} I am unable to kick the command executor.`)
            return
        }
        else if (!targetMember.hasPermission('ADMINISTRATOR') && !targetMember.roles.cache.has('805600802063515667')) {
            targetMember.kick()
            sendMessage(channel, `${tag} That use has been kicked.`)
            return
        }
        else if (targetMember.hasPermission('ADMINISTRATOR')) {
            sendMessage(channel, `${tag} I cannot kick an administrator!`)
            return
        }
        else if (targetMember.roles.cache.has('805600802063515667')) {
            sendMessage(channel, `${tag} I cannot kick a moderator!`)
            return
        }

    }
}
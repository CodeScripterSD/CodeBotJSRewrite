const sendMessage = require("@util/send-message")
const mongo = require('@util/mongo')
const warnSchema = require('@schemas/warn-schema')

module.exports = {
    commands: ['listwarnings', 'lw'],
    minArgs: 1,
    expectedArgs: "<Target user's @>",
    requiredRoles: ['• MODERATOR'],
    callback: async (message, arguments, text) => {
        const target = message.mentions.users.first()
        if (!target) {
            sendMessage(message.channel, `<@${message.member.id}> Please specify a user to load the warnings for.`);
            return;
        }

        const guildId = message.guild.id
        const userId = target.id

        await mongo().then(async mongoose => {
            try {
                const results = await warnSchema.findOne({
                    guildId,
                    userId,
                })

                if (!results) {
                    sendMessage(message.channel, `<@${message.member.id}>, Specified user doesn't have any warnings.`)
                    return
                }

                let reply = `Previous warnings for <@${userId}>:\n\n`

                for (const warning of results.warnings) {
                    const { author, timestamp, reason } = warning;

                    reply += `By ${author} on ${new Date(timestamp).toLocaleDateString()} for "${reason}"\n\n`
                    
                }
                message.reply(reply)
            } finally {
                mongoose.connection.close()
            }
        })
    }
}
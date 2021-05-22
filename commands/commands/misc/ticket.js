const sendMessage = require("@util/send-message")
let registered = false

const check = '✅'
const channelId = '840636823851237376'
const registerEvent = client => {
    if (registered) {
        return
    }

    registered = true

    console.log('REGISTERING EVENTS')

    client.on('messageReactionAdd', (reaction, user) => {
        if (user.bot) {
            return
        }

        console.log('HANDLING REACTION')
        const { message } = reaction
        if (message.channel.id === channelId) {
            message.delete()
        }
    })
}

module.exports = {
    commands: ['ticket', 'support'],
    minArgs: 1,
    expectedArgs: '<message>',
    description: 'Sends a help/support ticket to the overlords...',
    callback: (userMessage, arguments, text, client) => {
        const {guild, member } =  userMessage

        registerEvent(client)

        const channel = guild.channels.cache.get(channelId)
        channel.send(`A new ticket has been created by <@${member.id}>\n\n"${text}"\n\nClick the ${check} icon when this issue has been resolved.`)
            .then(ticketMessage => {
                ticketMessage.react(check)

                userMessage.reply('Your ticket has been sent! Expect a reply within 24 hours.')
            })
    },
}
const config = require('@root/config.json')

module.exports = (client) => {
    const channelIds = [
        '805600802080030759', // Suggestions
    ]

    const addReactions = message => {
        message.react('👍')

        setTimeout(() => {
            message.react('👎')
        }, 750)
    }

    client.on('message', async (message) => {
        if (channelIds.includes(message.channel.id)) {
            addReactions(message)
        }
    })
}

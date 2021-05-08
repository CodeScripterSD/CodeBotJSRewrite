const config = require('./config.json')

module.exports = client => {
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
        } else if (message.content.toLowerCase() === `${config.prefix}poll`){
            await message.delete()

            const fetched = await message.channel.messages.fetch({ limit: 1})
            if (fetched && fetched.first()) {
                addReactions(fetched.first())
            }
        } else if (message.content.toLowerCase() === `${config.prefix}unpoll`){
            await message.delete()

            const fetched = await message.channel.messages.fetch({ limit: 1})
            if (fetched && fetched.first()) {
                fetched.first().reactions.removeAll()
            }
        }
    })
}

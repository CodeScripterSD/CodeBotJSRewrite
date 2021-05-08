const mongo = require('./mongo')
const command = require('./command')
const sendMessage = require('./send-message')
const welcomeSchema = require('./schemas/welcome-schema')
const goodbyeSchema = require('./schemas/goodbye-schema')

module.exports = client => {
    //setwelcome <message>
    const cache = {} // guildId: [channelId, text]
    const leaveCache = {} 

    command(client, 'setwelcome', async (message) => {
        const { member, channel, content, guild } = message

        if (!member.hasPermission('ADMINISTRATOR')) {
            sendMessage(channel, `${member.user} You do not have adequate permission to run this command.`, 4)
            return
        }

        let text = content

        const split = text.split(' ')

        if (split.length < 2) {
            sendMessageI(channel, 'Please provide a welcome message', 5)
            return
        }

        split.shift()
        text = split.join(' ')

        cache[guild.id] = [channel.id, text]

        await mongo().then(async (mongoose) => {
            try {
                await welcomeSchema.findOneAndUpdate(
                    {
                        _id: guild.id
                    }, {
                        _id: guild.id,
                        channelId: channel.id,
                        text: text,
                    }, {
                        upsert: true,
                    }
                )
            } finally {
                mongoose.connection.close()
            }
        })

    })

    command(client, 'setgoodbye', async (message) => {
        const { member, channel, content, guild } = message

        if (!member.hasPermission('ADMINISTRATOR')) {
            sendMessage(channel, `${member.user} You do not have adequate permission to run this command.`, 4)
            return
        }

        let text = content

        const split = text.split(' ')

        if (split.length < 2) {
            sendMessage(channel, 'Please provide a dismissal message', 5)
            return
        }

        split.shift()
        text = split.join(' ')

        leaveCache[guild.id] = [channel.id, text]

        await mongo().then(async (mongoose) => {
            try {
                await goodbyeSchema.findOneAndUpdate(
                    {
                        _id: guild.id
                    }, {
                        _id: guild.id,
                        channelId: channel.id,
                        text: text,
                    }, {
                        upsert: true,
                    }
                )
            } finally {
                mongoose.connection.close()
            }
        })
    })

    const onJoin = async member => {
        const { guild } = member

        let data = cache[guild.id]

        if (!data) {
            console.log('FETCHING FROM DATABASE')
            await mongo().then(async mongoose => {
                try {
                    const result = await welcomeSchema.findOne({
                        _id: guild.id
                    })

                    cache[guild.id] = data = [result.channelId, result.text]
                } finally {
                    mongoose.connection.close()
                }
            })
        }

        const channelId = data[0]
        const text = data[1]
        const message = text.replace(/<server>/g, `**${member.guild.name}**`)
        const channel = guild.channels.cache.get(channelId)
        sendMessage(channel, message.replace(/<@>/g, `<@${member.id}>`))
    }

    const onLeave = async member => {
        const { guild } = member
        let data = leaveCache[guild.id]

        if (!data) {
            console.log('FETCHING FROM DATABASE')
            await mongo().then(async mongoose => {
                try {
                    const result = await goodbyeSchema.findOne({
                        _id: guild.id
                    })

                    leaveCache[guild.id] = data = [result.channelId, result.text]
                } finally {
                    mongoose.connection.close()
                }
            })
        }

        const leavechannelId = data[0]
        const leavetext = data[1]
        const leavemessage = leavetext.replace(/<server>/g, `**${member.guild.name}**`)
        const leavechannel = guild.channels.cache.get(leavechannelId)
        sendMessage(leavechannel, leavemessage.replace(/<@>/g, `${member.user.tag}`))
    }


    client.on('guildMemberAdd', member => {
        onJoin(member)
    })

    client.on('guildMemberRemove', member => {
        onLeave(member)
    })
}

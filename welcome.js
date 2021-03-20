module.exports = client => {
    const channelId = '805600802080030752' // welcome channel
    const getEmoji = (emojiName) => client.emojis.cache.find((emoji) => emoji.name === emojiName)
    const emoji = getEmoji('blue_tick')

    client.on('guildMemberAdd', member => {
        
        const message = `Hey <@${member.id}>, welcome to **${member.guild.name}**! React with ${emoji} in <#805600802080030754> to become verified and receive access to chats!`

        const channel = member.guild.channels.cache.get(channelId)
        //member.roles.add('805600802043199493')
        //member.roles.add('805600802029699125')
        console.log(member.user.fetchFlags())
        channel.send(message)
    })

    client.on('guildMemberRemove', member => {
        
        const message = `**${member.user.tag}** has left the server`

        const channel = member.guild.channels.cache.get(channelId)
        channel.send(message)
    })
}

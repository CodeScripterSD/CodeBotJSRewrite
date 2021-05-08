module.exports = client => {
    const memberChannelId = '824087952442523678'

    const updateMembers = guild => {
        const channel = guild.channels.cache.get(memberChannelId)
        channel.setName(`Members: ${guild.memberCount.toLocaleString()}`)
    }

    client.on('guildMemberAdd', (member) => updateMembers(member.guild))
    client.on('guildMemberRemove', (member) => updateMembers(member.guild))

    const guild = client.guilds.cache.get('805600802029699122')
    updateMembers(guild)
}
const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const command = require('./command')
const roleClaim = require('./role-claim')
const poll = require('./poll')
const welcome = require('./welcome')
const memberCount = require('./member-count')
const sendMessage = require('./send-message')
const mongo = require('./mongo')
const logs = require('./logFiles')

const prefix = config.prefix

client.on('ready', async () => {
    console.log('The client is ready!')

    await mongo().then(mongoose => {
        try {
            //try some code
            console.log('Connected to mongo!')
         } finally {
            //will always run
            mongoose.connection.close()
        }
    })

    logs(client)
    roleClaim(client)
    poll(client)
    welcome(client)
    memberCount(client)

    client.user.setPresence({
        activity: {
            name: `commands | ${prefix}help`,
            type: 3
        }
    })

    command(client, 'ban', message => {
        const { member, mentions, channel } = message
        const tag = `<@${member.id}>`

        if (member.hasPermission('BAN_MEMBERS') || member.hasPermission('ADMINISTRATOR')) {
            const target = mentions.users.first()
            if (!target) {
                sendMessage(channel, `${tag} Please specify someone to ban.`, 5)
                return
            }
            const targetMember = message.guild.members.cache.get(target.id)
            if (target.id === member.id) {
                sendMessage(channel, `${tag} You cannot ban yourself!`, 5)
                return
            }
            else if (!targetMember.hasPermission('ADMINISTRATOR') && !targetMember.roles.cache.has('805600802063515667')) {
                targetMember.ban()
                sendMessage(channel, `${tag} That user has been banned.`)
                return
            }
            else if (targetMember.hasPermission('ADMINISTRATOR')) {
                sendMessage(channel, `${tag} I cannot ban an administrator.`, 5)
                return
            }
            else if (targetMember.roles.cache.has('805600802063515667')) {
                sendMessage(channel, `${tag} I cannot ban a moderator!`, 5)
                return
            }
        } else {
            sendMessage(channel, `<@${member.id}> You do not have permission to run this command.`, 5)
            return
        }
    })

    command(client, 'kick', message => {
        const { member, mentions, channel } = message
        const tag = `<@${member.id}>`

        if (
            member.hasPermission('KICK_MEMBERS') ||
            member.hasPermission('ADMINISTRATOR')
        ) {
            const target = mentions.users.first()
            if (!target) {
                sendMessage(channel, `${tag} Please specify someone to kick.`, 5)
                return
            }
            const targetMember = message.guild.members.cache.get(target.id)
            if (target.id === member.id) {
                sendMessage(channel, `${tag} You cannot kick yourself!`, 5)
                return
            }
            else if (!targetMember.hasPermission('ADMINISTRATOR') && !targetMember.roles.cache.has('805600802063515667')) {
                targetMember.kick()
                sendMessage(channel, `${tag} That user has been kicked.`)
                return
            }
            else if (targetMember.hasPermission('ADMINISTRATOR')) {
                sendMessage(channel, `${tag} I cannot kick an administrator.`, 5)
                return
            }
            else if (targetMember.roles.cache.has('805600802063515667')) {
                sendMessage(channel, `${tag} I cannot kick a moderator!`, 5)
                return
            }
             else {
                sendMessage(channel, `${tag} Please specify someone to kick.`, 5)
                return
            }
        } else {
            sendMessage(channel, `<@${member.id}> You do not have permission to run this command.`, 5)
            return
        }
    })

    command(client, 'serverinfo', (message) => {
        const { guild, channel } = message

        const { name, region, memberCount, owner, afkTimeout } = guild
        const icon = guild.iconURL()

        const embed = new Discord.MessageEmbed()
            .setTitle(`Server info for "${name}`)
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
                value: afkTimeout / 60 + ' minutes',
            })
        
            sendMessage(channel, embed)
    })

    command(client, 'help', message => {
        const { channel } = message
        const icon = message.guild.iconURL()
        const embed = new Discord.MessageEmbed().setTitle('Help').setThumbnail(icon)

        if (message.member.hasPermission('BAN_MEMBERS')) {
            embed.addFields({
                name: 'Moderation:',
                value: `**${prefix}ban** <member.mention>\n**${prefix}kick** <member.mention>`,
            })
        }
        else if (message.member.hasPermission('KICK_MEMBERS')) {
            embed.addFields({
                name: 'Moderation:',
                value: `**${prefix}kick** <member.mention>`,
            })
        }
        embed.addFields({
            name: 'Generic',
            value: `**${prefix}serverinfo**\n**${prefix}poll**\n**${prefix}unpoll**`
        })
        
        sendMessage(channel, embed)
    })
})
client.login(config.token)

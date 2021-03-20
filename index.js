const Discord = require('discord.js')
const fsLibrary = require('fs')
const client = new Discord.Client()

const config = require('./config.json')
const command = require('./command')
const roleClaim = require('./role-claim')
const poll = require('./poll')
const welcome = require('./welcome')
const memberCount = require('./member-count')
const sendMessage = require('./send-message')

const prefix = config.prefix

const logFile = fsLibrary.createWriteStream('./logs/chat.txt', {
    flasg: 'a', //flags: 'a' preserved old data
})

client.on('ready', () => {
    console.log('The client is ready!')

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
            }
            else if (!targetMember.hasPermission('ADMINISTRATOR') && !targetMember.roles.cache.has('822279318204841995')) {
                targetMember.ban()
                sendMessage(channel, `${tag} That user has been banned.`, -1)
            }
            else if (targetMember.hasPermission('ADMINISTRATOR')) {
                sendMessage(channel, `${tag} I cannot ban an administrator.`, 5)
            }
            else if (targetMember.roles.cache.has('822279318204841995')) {
                sendMessage(channel, `${tag} I cannot ban someone in the Protection Program!`, 5)
            }
        } else {
            sendMessage(channel, `<@${member.id}> You do not have permission to run this command.`, 5)
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
            if (!target) return;
            const targetMember = message.guild.members.cache.get(target.id)
            if (target.id === member.id) {
                sendMessage(channel, `${tag} You cannot kick yourself!`, 5)
            }
            else if (!targetMember.hasPermission('ADMINISTRATOR') && !targetMember.roles.cache.has('822279318204841995')) {
                targetMember.kick()
                sendMessage(channel, `${tag} That user has been kicked.`, -1)
            }
            else if (targetMember.hasPermission('ADMINISTRATOR')) {
                sendMessage(channel, `${tag} I cannot kick an administrator.`, 5)
            }
            else if (targetMember.roles.cache.has('822279318204841995')) {
                sendMessage(channel, `${tag} I cannot kick someone in the Protection Program!`, 5)
            }
             else {
                sendMessage(channel, `${tag} Please specify someone to kick.`, 5)
            }
        } else {
            sendMessage(channel, `<@${member.id}> You do not have permission to run this command.`, 5)
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
        
            sendMessage(channel, embed, -1)
    })

    command(client, 'help', message => {
        const { channel } = message
        const icon = message.guild.iconURL()
        const embed = new Discord.MessageEmbed().setTitle('Help').setThumbnail(icon)

        if (message.member.hasPermission('BAN_MEMBERS')) {
            embed.addFields({
                name: 'Moderation:',
                value: `**${prefix}ban** <member.mention>\n**${prefix}kick** <member.mention>`,
            },
            {
                name: 'Generic',
                value: `**${prefix}serverinfo**`
            })
        }
        else if (message.member.hasPermission('KICK_MEMBERS')) {
            embed.addFields({
                name: 'Moderation:',
                value: `**${prefix}kick** <member.mention>`,
            },
            {
                name: 'Generic',
                value: `**${prefix}serverinfo**`
            })
        } else {
            embed.addFields({
                name: 'Generic',
                value: `**${prefix}serverinfo**`
            })
        }
        
        sendMessage(channel, embed, -1)
    })

    client.on('message', message => {
        logFile.write(`In ${message.channel.name}, ${message.author.tag} said: ${message.content}\r\n`)
    })
})
client.login(config.token)

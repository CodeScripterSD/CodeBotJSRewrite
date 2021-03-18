const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const privateMessage = require('./private-message')
const command = require('./command')
const firstMessage = require('./first-message')

client.on('ready', () => {
    console.log('The client is ready!')

    firstMessage(client, '805600802080030754', 'unfinished cuz am lazy', ['🗡️'])

    command(client, 'watch', message => {
        if (message.member.roles.cache.some(role => role.name === 'Bot Operator')) {
            const content = message.content.replace('!watch ', '')

            client.user.setPresence({
                activity: {
                    name: content,
                    type: 3
                }
            })
        }
        
    })

    command(client, 'play', message => {
        if (message.member.roles.cache.some(role => role.name === 'Bot Operator')) {
            const content = message.content.replace('!play ', '')

            client.user.setPresence({
                activity: {
                    name: content,
                    type: 1
                }
            })
        }
        
    })

    command(client, 'ctext', (message) => {
        if (message.member.roles.cache.some(role => role.name === 'Bot Operator')) {
            const name = message.content.replace('!ctext ', '')

            message.guild.channels
                .create(name, {
                    type: 'text',
                })
        }
    })

    command(client, 'cvoice', (message) => {
        if (message.member.roles.cache.some(role => role.name === 'Bot Operator')) {
            const name = message.content.replace('!cvoice ', '')

            message.guild.channels
                .create(name, {
                    type: 'voice',
                })
                .then((channel) => {
                    channel.setUserLimit(10)
                })
        }
    })

    command(client, 'datapacks', message => {
        const embed = new Discord.MessageEmbed().setTitle('Datapacks')
        message.channel.send(embed)
    })


})

client.on('guildMemberAdd', member => {
    if (member.bot) return;
    const channel = member.guild.channels.cache.find(ch => ch.name === '👋welcome-and-goodbye')

    if (!channel) return;

    channel.send(`Welcome to **${member.guild.name}**, ${member}`)
})

client.on('guildMemberRemove', member => {
    if (member.bot) return;
    const channel = member.guild.channels.cache.find(ch => ch.name === '👋welcome-and-goodbye')

    if (!channel) return;

    channel.send(`**${member.displayName}** has left the server`)
})

client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content === '$argument-status') {
        message.channel.send('Mythic Mac and Chief seem to be tied at 3 points each. The reading states that the argument is very likely to last until the server goes public. More updates coming out soon!')
    }
    if (message.content.includes('69')) {
        message.channel.send('69? Nice.')
    }
})

client.login(config.token)

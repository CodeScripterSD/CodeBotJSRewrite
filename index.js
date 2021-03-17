const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const command = require('./command')
const firstMessage = require('./first-message')

client.on('ready', () => {
    console.log('The client is ready!')

    firstMessage(client, config.roles_channel, 'Reaction Roles', [''])

    command(client, 'status', message => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            const content = message.content.replace('c!status ', '')

            client.user.setPresence({
                activity: {
                    name: content,
                    type: 3
                }
            })
        }
        
    })
})

client.login(config.token)
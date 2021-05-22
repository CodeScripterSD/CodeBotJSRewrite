require('module-alias/register')

const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('@root/config.json')
const mongo = require('@util/mongo')
const loadCommands = require('@root/commands/load-commands')
const loadFeatures = require('@root/features/load-features')

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

    client.user.setPresence({
        activity: {
            name: `commands | ${prefix}help`,
            type: 3
        }
    })

    loadCommands(client)
    loadFeatures(client)
})

client.login(config.token)

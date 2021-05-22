const sendMessage = require("@util/send-message")

module.exports = {
    commands: 'ping',
    callback: (message, arguments, text, client) => {
        message.reply('Calculating ping...').then(resultMessage => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp

            resultMessage.edit(`Bot latency: ${ping}ms, API Latency: ${client.ws.ping}ms`)
        })
    }
}
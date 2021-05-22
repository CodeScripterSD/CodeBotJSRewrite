// LOG FILES
const fsLibrary = require('fs')
const chatFile = fsLibrary.createWriteStream('./logs/chat.txt', {
    flags: 'a', //flags: 'a' preserved old data
})
const channelLogFile = fsLibrary.createWriteStream('./logs/channelLogs.txt', {
    flags: 'a', //flags: 'a' preserved old data
})
const messageUpdated = fsLibrary.createWriteStream('./logs/updatedMessage.txt', {
    flags: 'a', //flags: 'a' preserved old data
})
const messageDeleted = fsLibrary.createWriteStream('./logs/deletedMessage.txt', {
    flags: 'a', //flags: 'a' preserved old data
})

// EVENT LISTENERS
// ALL LISTENERS MUST HAVE THEIR OWN timeNow OBJECTS, OTHERWISE TIME WILL MATCH WHEN THE BOT STARTED AND NOT RETURN AN ACCURATE TIME

module.exports = (client) => {
    client.on('message', (message) => {
        dateTime = new Date();

        let date = ("0" + dateTime.getDate()).slice(-2);
        let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
        let year = dateTime.getFullYear();
        let hours = dateTime.getHours();
        let minutes = dateTime.getMinutes();
        let timeNow = `Date: ${year} ${month} ${date}, Time: ${hours}:${minutes}`
        chatFile.write(`At ${timeNow}, in ${message.channel.name}, ${message.author.tag} said: ${message.content}\r\n`)
    })

    client.on('channelCreate', (channel) => {
        dateTime = new Date();

        let date = ("0" + dateTime.getDate()).slice(-2);
        let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
        let year = dateTime.getFullYear();
        let hours = dateTime.getHours();
        let minutes = dateTime.getMinutes();
        let timeNow = `Date: ${year} ${month} ${date}, Time: ${hours}:${minutes}`
        channelLogFile.write(`At ${timeNow}, ${channel.name} was created of type: ${channel.type} with the ID of: ${channel.id}\r\n`)
    }) 

    client.on('channelDelete', (channel) => {
        dateTime = new Date();

        let date = ("0" + dateTime.getDate()).slice(-2);
        let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
        let year = dateTime.getFullYear();
        let hours = dateTime.getHours();
        let minutes = dateTime.getMinutes();
        let timeNow = `Date: ${year} ${month} ${date}, Time: ${hours}:${minutes}`
        channelLogFile.write(`At ${timeNow}, ${channel.name} was deleted\r\n`)
    })

    client.on('messageUpdate', (oldMessage, newMessage) => {
        dateTime = new Date();

        if (oldMessage.author.bot) return
        let date = ("0" + dateTime.getDate()).slice(-2);
        let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
        let year = dateTime.getFullYear();
        let hours = dateTime.getHours();
        let minutes = dateTime.getMinutes();
        let timeNow = `Date: ${year} ${month} ${date}, Time: ${hours}:${minutes}`
        messageUpdated.write(`At ${timeNow}, in ${oldMessage.channel.name}, ${oldMessage.author.tag} edited their message of: \n'${oldMessage.content}'\nto say: \n'${newMessage.content}'\r\n`)
    })

    client.on('messageDelete', (message) => {
        dateTime = new Date();

        if (message.author.bot) return
        let date = ("0" + dateTime.getDate()).slice(-2);
        let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
        let year = dateTime.getFullYear();
        let hours = dateTime.getHours();
        let minutes = dateTime.getMinutes();
        let timeNow = `Date: ${year} ${month} ${date}, Time: ${hours}:${minutes}`
        messageDeleted.write(`At ${timeNow}, ${message.author.tag}'s message of "${message.content}" was deleted.\r\n`)
    })
}
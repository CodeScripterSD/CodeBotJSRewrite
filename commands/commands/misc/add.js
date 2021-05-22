module.exports = {
    commands: ['add', 'combine'],
    expectedArgs: '<num1> <num2>',
    minArgs: 2,
    maxArgs: 2,
    description: 'Adds two numbers.',
    callback: (message, arguments, text) => {
        const num1 = +arguments[0]
        const num2 = +arguments[1]

        message.reply(`The sum is ${num1 + num2}`)
    }
}
const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const goodbyeSchema = mongoose.Schema({
    _id: reqString,
    channelId: reqString,
    text: reqString
})

module.exports = mongoose.model('goodbye-channels', goodbyeSchema)
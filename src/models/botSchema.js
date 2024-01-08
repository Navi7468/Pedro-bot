const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
    status: {
        type: String,
        default: 'online',
        enum: ['online', 'idle', 'dnd', 'invisible']
    },
    activity: {
        name: { type: String, default: 'with your mom' },
        type: {
            type: String,
            default: 'PLAYING',
            enum: ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'COMPETING']
        },
    },
    defaults: {
        prefix: { type: String, default: '!' },
        volume: { type: Number, default: 10 },
        language: { type: String, default: 'en' },
        timezone: { type: String, default: 'America/Los_Angeles' }
    },
    __v: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Bot', botSchema);
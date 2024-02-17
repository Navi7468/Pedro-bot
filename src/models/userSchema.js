const mongoose = require('mongoose');

const UserGuildRoleSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    roleId: { type: String, required: true },
    roleName: { type: String, required: true },
    roleColor: { type: String, required: true }
});

const ModActionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    executor: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now() }
});

const serverSpecificSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    guildName: { type: String, required: true },
    fistJoin: { type: Date, default: Date.now() },
    lastJoin: { type: Date, default: Date.now() },
    joinCount: { type: Number, default: 0 },
    leaveCount: { type: Number, default: 0 },
    lastLeave: { type: Date, default: null },
    leave: { type: Boolean, default: false },
    messages: {
        count: { type: Number, default: 0 },
        lastMessage: { type: Date, default: null },
        channels: [{
            channelId: String,
            channelName: String,
            count: { type: Number, default: 0 },
            lastMessage: { type: Date, default: null }
        }]
    },
    voice: {
        count: { type: Number, default: 0 },
        lastJoin: { type: Date, default: null },
        lastLeave: { type: Date, default: null },
        lastSession: { type: Number, default: 0 },
        channels: [{
            channelId: String,
            channelName: String,
            count: { type: Number, default: 0 },
            lastJoin: { type: Date, default: null },
            lastLeave: { type: Date, default: null }
        }],
        sessions: [{
            join: { type: Date, default: null },
            leave: { type: Date, default: null },
            duration: { type: Number, default: 0 },
            switches: [{
                channelId: String,
                channelName: String,
                time: { type: Date, default: null }
            }],
            mutes: [{
                time: { type: Date, default: null },
                duration: { type: Number, default: 0 },
                server: { type: Boolean, default: false },
            }],
            deafens: [{
                time: { type: Date, default: null },
                duration: { type: Number, default: 0 },
                server: { type: Boolean, default: false },
            }],
            screenshares: [{
                time: { type: Date, default: null },
                duration: { type: Number, default: 0 }
            }]
        }]
    },
    birthday: {
        date: { type: Date, default: null },
        announce: { type: Boolean, default: false }
    },
    guildRole: UserGuildRoleSchema,
    bans: [ModActionSchema],
    kicks: [ModActionSchema],
    mutes: [ModActionSchema],
    warns: [ModActionSchema],
    notes: [{
        note: { type: String, required: true },
        executor: {
            id: { type: String, required: true },
            username: { type: String, required: true }
        },
        date: { type: Date, default: Date.now() }
    }]
});

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    globalName: { type: String, required: true },
    birthday: { type: Date, default: null },
    servers: [serverSpecificSchema],
    guildRole: [UserGuildRoleSchema],
    __v: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Users', userSchema);
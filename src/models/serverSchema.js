const mongoose = require('mongoose');

const EmbedSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    color: { type: String },
    fields: [{ name: String, value: String, inline: Boolean }],
    author: { name: String, icon_url: String },
    thumbnail: { type: String },
    footer: { type: String },
    timestamp: { type: Boolean },
});

const EventSettingsSchema = new mongoose.Schema({
    enabled: { type: Boolean, required: true },
    channelId: { type: String, required: false },
    messages: [{ type: String, required: true }],
    type: { type: String, required: true, enum: ['message', 'embed'] },
    embed: EmbedSchema
});

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    emoji: { type: String },
    ignoreSingle: { type: Boolean }
});

const serverSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    guildName: { type: String, required: true },
    prefix: { type: String, default: '!' },
    volume: { type: Number, default: 5 },
    events: {
        memberJoin: EventSettingsSchema,
        memberLeave: EventSettingsSchema,
        messageDelete: EventSettingsSchema,
        messageUpdate: EventSettingsSchema,
        inviteCreate: EventSettingsSchema,
        counting: EventSettingsSchema,
        birthday: EventSettingsSchema
    },
    roles: {
        birthdayRole: RoleSchema,
        muteRole: RoleSchema,
        botRole: RoleSchema,
        autoRoles: [RoleSchema],
        selfRoles: [{ name: String, reactionId: String, single: Boolean, roles: [RoleSchema] }]
    },
    __v: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Servers', serverSchema);
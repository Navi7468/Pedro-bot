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
    channelId: { type: String, required: true },
    messages: [{ type: String, required: true }],
    type: { type: String, required: true, enum: ['message', 'embed'] },
    embed: EmbedSchema
});

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    emoji: { type: String }
});

const serverSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    guildName: { type: String, required: true },
    prefix: { type: String, default: '!' },
    events: {
        memberJoin: EventSettingsSchema,
        memberLeave: EventSettingsSchema
    },
    roles: {
        birthdayRole: RoleSchema,
        muteRole: RoleSchema,
        autoRoles: [RoleSchema],
        selfRoles: [{ name: String, reactionId: String, roles: [RoleSchema] }]
    },
    __v: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Servers', serverSchema);
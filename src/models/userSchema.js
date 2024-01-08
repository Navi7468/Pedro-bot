const mongoose = require('mongoose');

const UserGuildRoleSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    roleId: { type: String, required: true },
    roleName: { type: String, required: true },
    roleColor: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    globalName: { type: String, required: true },
    birthday: { type: Date, default: null },
    guildRole: [UserGuildRoleSchema],
    __v: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Users', userSchema);
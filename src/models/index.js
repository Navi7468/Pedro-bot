const Bot = require('./botSchema');
const Server = require('./serverSchema');
const User = require('./userSchema');

module.exports = {
    botSchema: Bot,
    serverSchema: Server,
    userSchema: User
};
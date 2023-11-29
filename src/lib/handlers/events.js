const fs = require('fs');

module.exports = (client) => {
    fs.readdirSync('./src/events').forEach(async (dir) => {
        fs.readdirSync(`./src/events/${dir}`).filter((file) => file.endsWith('.js')).forEach(async (event) => {
            require(`../../events/${dir}/${event}`);
        });
    });
}
const client = require("../../..");

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
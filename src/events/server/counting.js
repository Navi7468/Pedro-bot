const { serverSchema } = require('@models');
const logger = require('@utils/logger');
const client = require('@client');

client.on('messageReactionAdd', async (reaction, user) => {
});
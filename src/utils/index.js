const { checkCooldown, hasRequiredPermissions } = require('./commandHelpers');
const { replaceText } = require('./messageHelpers');
const { fontConverter } = require('./fontConverter');
const logger = require('./logger');

module.exports = {
    logger: logger,
    checkCooldown: checkCooldown,
    hasRequiredPermissions: hasRequiredPermissions,
    replaceText: replaceText,
    fontConverter: fontConverter
}
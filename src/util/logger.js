const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

const fs = require('fs');
const path = require('path');
const logDir = './logs';

const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: combine(colorize(), logFormat)
        }),
        new winston.transports.File({ filename: path.join(logDir, `${new Date().toISOString().slice(0, 10)}.log`) })
    ]
});

// Clear logs folder every 7 days
(async function () {


    fs.readdir(logDir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(logDir, file), err => {
                if (err) throw err;
            });
        }
    });
})();

logger.on('error', (error) => {
    console.error('Logging error:', error);
});

module.exports = logger;

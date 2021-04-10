const winston = require('winston');
const path = require('path');

const logFile = (process.platform === 'win32' ? 'logs/' + process.env.nodeEnv + '/logs.json' :'/var/log/nodejs-winston/' + process.env.nodeEnv + '/logs.json');

const logTest = winston.createLogger({
    level: 'debug',
    levels: winston.config.syslog.levels,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: logFile,
            level: 'info'
        }),
        new winston.transports.Console()
    ]
});

module.exports = logTest;

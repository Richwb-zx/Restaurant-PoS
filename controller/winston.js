const winston = require('winston');
const path = require('path');
const util = require('util');
const MESSAGE = Symbol.for('message');

const logFile = (process.platform === 'win32' ? 'logs/' + process.env.nodeEnv + '/logs.json' :'/var/log/nodejs-winston/' + process.env.nodeEnv + '/logs.json');

const logTest = winston.createLogger({
    level: 'debug',
    levels: winston.config.syslog.levels,
    format: winston.format.combine(
        winston.format(function(info, opts) {
            prefix = util.format(
                '{"level": "%s", "date": %d, "message": "%s", "user": "%s", "namespace": "%s"}', 
                info.level, 
                Math.round(new Date() / 1000), 
                info.message, 
                info.user, 
                info.namespace
            );

            info[MESSAGE] = prefix;
            return info;
        })(),
    ),
    transports: [
        new winston.transports.File({
            filename: logFile,
            level: 'info'
        }),
    ]
});

module.exports = logTest;

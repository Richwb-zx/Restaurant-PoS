const winston = require('winston');
const util = require('util');
const MESSAGE = Symbol.for('message');
const Transport = require('winston-transport');
const fs = require('fs');

const logFile = (process.platform === 'win32' ? './logs/' + process.env.nodeEnv + '/logs.json' :'/var/log/nodejs-winston/' + process.env.nodeEnv + '/logs.json');

class CustomTransport extends Transport {
    constructor(opts){
        super(opts);
    }

    readLog(){
        let logJson = [];
        if(fs.existsSync(logFile) === false){
            this.createLog();
        }

        logJson = JSON.parse(fs.readFileSync(logFile, 'utf8'));

        return logJson;
    }

    createLog(){
        const logContent = '{"emerg":[],"alert":[],"crit":[],"error":[],"warning":[],"notice":[],"info":[],"debug":[]}';

        fs.writeFileSync(logFile, logContent, 'utf8');
    }

    writeToLog(info){
        const logJson = this.readLog();
       
        logJson[info.level].push(info);
        const logStringify = JSON.stringify(logJson);

        try{
            fs.writeFileSync(logFile, logStringify, 'utf8');
        }catch(error){
            console.log('error');
        }
    }

    log(info, callback){
        setImmediate(() => {
            this.emit('logged', info[MESSAGE]);
        });

        this.writeToLog(JSON.parse(info[MESSAGE]));

        callback();
    }

    createMessage(error){
        let message = '';
        switch(error.code){
            case 'ECONNREFUSED':
                message = `Connection error on ${error.address}: ${error.port}`;
                break;
            default:
                message = `Unknown error. Code: ${error.code} syscall: ${error.syscall}`;      
        }

       return message;
    }
}

const logger = winston.createLogger({
    level: 'debug',
    levels: winston.config.syslog.levels,
    format: winston.format.combine(
        winston.format(function(info, opts) {
            message = (info.message !== undefined ? info.message : this.createErrorMessage(info.error));
            prefix = util.format(
                '{"level": "%s", "date": %d, "message": "%s", "user": "%s", "namespace": "%s"}', 
                info.level, 
                Math.round(new Date() / 1000), 
                message, 
                info.user, 
                info.namespace
            );

            info[MESSAGE] = prefix;
            return info;
        })(),
    ),
    transports: [
        new CustomTransport({
            filename: logFile
        }),
        new winston.transports.Console()
    ]
});

module.exports = logger;

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
        
        if(fs.existsSync(logFile) === false){
            this.createLog();
        }

        let logJson = fs.readFileSync(logFile, 'utf8');
        logJson = JSON.parse(logJson);
       
        return logJson;
    }

    createLog(){
        const logContent = '{"emerg":[],"alert":[],"crit":[],"error":[],"warning":[],"notice":[],"info":[],"debug":[]}';

        fs.writeFileSync(logFile, logContent, 'utf8');
    }

    writeToLog(info){
        const logJson = this.readLog();  
        
        let infoRaw = JSON.parse(info);
        infoRaw.message = unescape(infoRaw.message);

        logJson[infoRaw.level].push(infoRaw);
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

        this.writeToLog(info[MESSAGE]);

        callback();
    }
}

const logger = winston.createLogger({
    level: 'debug',
    levels: winston.config.syslog.levels,
    format: winston.format.combine(
        winston.format(function(info, opts) {
            message = (info.message.code === undefined ? info.message : createErrorMessage(info));
           
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

const createErrorMessage = (info) =>{
    const error = info.message;
    let message = '';

    if(error.address !== undefined){
        message = `${error.code} on ${error.address}:${error.port}`;
    }else{
        message = error.code;
    }

   return message;
}

module.exports = logger;

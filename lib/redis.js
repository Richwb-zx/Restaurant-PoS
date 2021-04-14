const client = require('redis').createClient();
const logger = require('../controller/winston.js');

client.on('error', error =>{
    let message = '';
    switch(error.code){
        case 'ECONNREFUSED':
            message = `Redis Connection error on ${error.address}: ${error.port}`;
            break;
        default:
            message = `Redis unknown error. Code: ${error.code} syscall: ${error.syscall}`;
            
    }

    logger.crit({"message": `${message}`, "user": 'System', "namespace": 'redis.client.error'});
    process.exit();
});


module.exports = client;
const client = require('redis').createClient();
const logger = require('../controller/winston.js');

client.on('error', error =>{
    console.log(error);
    logger.crit({"message": {"code": escape(error)}, "user": 'System', "namespace": 'redis.client.connected.error'});
    process.exit();   
});

client.on('connect', () => {
    logger.info({"message": "Redis is connected", "user": 'System', "namespace": 'redis.client.connected.connected'});
});

module.exports = client;
const schedule = require('node-schedule');
const client = require('../lib/redis.js');
const logger = require('../controller/winston.js');

const crontask = schedule.scheduleJob('*/1 * * * *', (error, res) => {
    const nowSeconds = Math.round(new Date().getTime() / 1000);
    let redisKey = '';

    client.lrange('jwtblacklist', 0 , -1, (error, res) => {
        if(error !== null){
            logger.error(logger.error({"message": {"code": escape(error)}, "user": "system", "namespace": 'crontask.schedulejobs.blacklist.lrange'}));
        }else{
            res.forEach(jwtBlDate => {
                if(jwtBlDate < nowSeconds){
                    redisKey = 'jwtbl-' + jwtBlDate;
                    client.DEL(redisKey);
                    client.LREM('jwtblacklist', -1, jwtBlDate);
                }
            });
        }
    });
});

module.exports = crontask;
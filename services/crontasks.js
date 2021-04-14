const schedule = require('node-schedule');
const client = require('../lib/redis.js');

const crontask = schedule.scheduleJob('*/1 * * * *', (error, res) => {
    const nowSeconds = Math.round(new Date().getTime() / 1000);
    let redisKey = '';

    client.lrange('jwtblacklist', 0 , -1, (error, res) => {
        
        res.forEach(jwtBlDate => {
            if(jwtBlDate < nowSeconds){
                redisKey = 'jwtbl-' + jwtBlDate;
                // TODO error handling
                client.DEL(redisKey);
                client.LREM('jwtblacklist', -1, jwtBlDate);
            }
        });
    });
});

module.exports = crontask;
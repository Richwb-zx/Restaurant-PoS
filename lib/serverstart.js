const routesAuth = require('../models/routes_authorization');
const logger = require('../controller/winston.js');
const client = require('./redis');

const ServerStart = class ServerStart{

    async getRoutes(){
        routesAuth.query().select('group_id','route','route_type').joinRelated('routes').where('routes_authorization.active', 1).where('routes.active', 1)
        .then(result =>{
            this.sendRoutesToRedis(result);
        })
        .catch(error => {
            logger.crit({"message": error, "user": "system", "namespace": 'serverstart.getroutes.select.error'});
        });
    }

       
    sendRoutesToRedis(routes){
        routes.forEach(function(route){
            client.set(`route-${route.route}-${route.route_type}-${route.group_id}` , 1, function(error){
                if(error !== null){
                    logger.crit({"message": {"code": escape(error)}, "user": 'System', "namespace": 'startserver.redis.storeroutes.error'});
                }
            });
        });
    }
}

module.exports = ServerStart;
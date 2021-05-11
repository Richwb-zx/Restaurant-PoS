const jwt = require('jsonwebtoken');
const client = require('./lib/redis.js');
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
const jwtverify = promisify(jwt.verify).bind(jwt);

const checkSession = async (req, res, next) => {

    const token = req.cookies.token;
    const pathName = req._parsedUrl.pathname;
    const httpMethod = req.method;
    const referrer = (req.get('Referrer') !== '' ? req.get('Referrer') : '/login');
    
    if(token === undefined){
        if(await authorizationCheck(pathName,httpMethod, 1) === false){
            return res.redirect(301, referrer);
        }
    }else{
        const decoded = await jwtverify(token, process.env.node_sess_secret)
        .then(decoded => {return decoded})
        .catch(verifyError =>{
            switch(verifyError['name']){
                case 'TokenExpiredError':
                    switch(path){
                        case '/login':
                            res.clearCookie('token').status('301').redirect(referrer);
                            debugger;
                            break;
                        default:
                            return res.redirect(301, referrer);
                    }
                    break;
                default:
                    logger.error({"message": {"code": escape(error)}, "user": decoded.group, "namespace": 'handlers.checkSession.jwtverify.error'});
            }
        });

        if(await authorizationCheck(pathName,httpMethod, decoded.group) === false){
            return res.redirect(301, referrer);
        }
        
        if(decoded.exp - (Date.now()/1000) <= 300){
            const token = jwt.sign(
                {user: decoded.user, group: decoded.group}, 
                process.env.node_sess_secret, 
                {algorithm: "HS256", expiresIn: process.env.node_sess_life 
            });

            res.cookie('token', token, {maxAge: process.env.node_sess_life,  httpOnly: true, secure: true});
        } 
    }

    next();
}

async function authorizationCheck(route, method, groupId){
    return await getAsync(`route-${route}-${method}-${groupId}`)
        .then(function(result){ 
            if(result !== null){
                return true;
            }else{
                return false;
        }})
        .catch(function(error){
            logger.error({"message": {"code": escape(error)}, "user": 'System', "namespace": 'handlers.authorizationCheck.redis.error'});
            return false;
        });
}

module.exports.checkSession = checkSession;
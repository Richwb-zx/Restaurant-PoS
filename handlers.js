const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');
const jwtverify = promisify(jwt.verify).bind(jwt);
const clientKeys = promisify(client.keys).bind(client);
const clientlrange = promisify(client.lrange).bind(client);

const checkSession = async (req, res, next) => {

    const token = req.cookies.token;

    const path = req.path;
    // TODO clean up after testing
    if(path === '/test' || token === undefined && (path === '/login' || path === '/register' || path === '/loginauth')){
        next();
    }else if(token !== false && path === '/loginauth'){
        res.redirect('/');
    }else if(token === undefined && path !== '/login'){
        res.redirect('/login');
    }else{

        const decoded = await jwtverify(token, process.env.node_sess_secret)
        .then(decoded => {return decoded})
        .catch(verifyError =>{
            switch(verifyError['name']){
                case 'TokenExpiredError':
                    switch(path){
                        case '/login':
                            res.clearCookie('token');
                            next();
                            break;
                        default:
                            res.redirect('/login');
                    }
                    break;
                default:
                    // TODO error handling
                    console.log('error', error);
            }
        });

        const redisKeySearch = 'jwtbl-' + decoded.exp;
        let jwtFound = false;

        const redisKey = await clientKeys(redisKeySearch)
            .then(redisKeyResults => {
                return (redisKeyResults.length > 0 ? redisKeyResults : false);
            })
            .catch(redisKeyError => {
                console.log(redisKeyError);
                //TODO error handling
            });
        
        if(redisKey !== false){
            await clientlrange(redisKey[0], 0, -1)
                .then(redisDateRes => {
                    redisDateRes.forEach(redisToken => {
                        console.log('redistoken',redisToken);
                        console.log('token',token);
                        if(redisToken === token){
                            jwtFound = true;
                        }
                    });
                })
                .catch(redisDateerror => {
                    console.log(redisDateerror);
                    //TODO error handling
            });
        }

        if(jwtFound === true && path !== '/logout'){
            console.log('yup');
            res.status(401).send('session has ended');
        }else{
            console.log('nope');
            if(decoded.exp - (Date.now()/1000) <= 300){
                const token = jwt.sign({username: decoded.username}, process.env.node_sess_secret, {algorithm: "HS256", expiresIn: process.env.node_sess_life });
                res.cookie('token', token, {maxAge: process.env.node_sess_life,  httpOnly: true, secure: true});
            
            }

            switch(path){
                case '/login':
                    res.redirect('/test');    
                    break;
                default:
                    next();
            }
        } 
    }
}

module.exports.checkSession = checkSession;
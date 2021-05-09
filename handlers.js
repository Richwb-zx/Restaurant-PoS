const jwt = require('jsonwebtoken');
const client = require('./lib/redis.js');
const { promisify } = require('util');
const jwtverify = promisify(jwt.verify).bind(jwt);
const Users = require('./models/users');

const checkSession = async (req, res, next) => {

    const token = req.cookies.token;
    const pathName = req._parsedUrl.pathname;
    const httpMethod = req.method;
    
    // const routeAuthGroup = routeAuthData[0].group_name;
    // console.log(routeAuthData);
    
    if(token === undefined){

    }else{
        console.log(req.headers);
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

        const routeAuthData = await authorizationCheck(pathName,httpMethod, decoded.username);
        console.log(routeAuthData);
    }

    // if(routeAuthGroup === 'Public' && token === undefined){

    // }else if(routeAuthGroup === 'Public' && token !== undefined){
        
    // }else if(routeAuthGroup !== 'Public' && token !== undefined){

    // }

    const path = req.path;
    // TODO clean up after testing
    if(path === '/test' || token === undefined && (path === '/login' || path === '/register' || path === '/loginauth')){
        next();
    }else if(token !== false && path === '/loginauth'){
        res.redirect('/');
    }else if(token === undefined && path !== '/login'){
        res.redirect('/login');
    }else{

        

        

        if(jwtFound === true && path !== '/logout'){
            console.log('yup');
            res.status(401).send('session has ended');
        }else{
            console.log('nope');
            if(decoded.exp - (Date.now()/1000) <= 300){
                const token = jwt.sign({user: decoded.user}, process.env.node_sess_secret, {algorithm: "HS256", expiresIn: process.env.node_sess_life });
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

const authorizationCheck = async (path, method, userId)=>{
    client.get
}

module.exports.checkSession = checkSession;
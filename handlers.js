const jwt = require('jsonwebtoken');

const checkSession = (req, res, next) => {
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
        response = jwt.verify(token, process.env.node_sess_secret, (error, decoded) => {       
            if(error){
                switch(error['name']){
                    case 'TokenExpiredError':
                        switch(path){
                            case '/login':
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
            }else if(decoded){
                if(decoded.exp - (Date.now()/1000) <= 300){
                    const token = jwt.sign({username: decoded.username}, process.env.node_sess_secret, {algorithm: "HS256", expiresIn: process.env.node_sess_life });
                    res.cookie('token', token, {maxAge: process.env.node_sess_life});
	            
                }

                switch(path){
                    case '/login':
                        res.redirect('/test');    
                        break;
                    default:
                        next();
                }
            }
        });   
    }
}

const responseSecurityHeaders =(req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Content-Security-Policy": "default-src *",
        "X-Content-Security-Policy": "default-src *",
        "X-WebKit-CSP": "default-src *"
    })
    next();
}

module.exports.checkSession = checkSession;
module.exports.responseSecurityHeaders = responseSecurityHeaders;
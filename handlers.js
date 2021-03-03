const jwt = require('jsonwebtoken');

const checkSession = (req, res, next) => {
    
    const token = req.cookies.token;
    const path = req.path;

    if(!token && path == '/login'){
        next();
    }else if(!token && path !== '/login'){
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
                        console.log(error);
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

module.exports = checkSession;
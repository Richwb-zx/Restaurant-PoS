const checkSession = (req, res, next) => {
    console.log(req.cookies.token);
    const token = req.cookies.token;

    if(!token && req.path !== '/login' ){
        res.redirect('/login');
    }else if(token && req.path !== '/login'){
        res.redirect('/');
    }

    next();
}

module.exports = checkSession;
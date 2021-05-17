const express = require('express');
const router = express.Router();
const authentication = require('../controller/authentication.js');

router.get('/', (req, res) =>{
    res.status(200).send('HOME PAGE');
});

router.get('/login', (req, res) => {
    res.status(200).send('LOGIN');
});

router.post('/loginauth', async (req, res) =>{
    
    const authenticate = new authentication(req.query.userName, req.query.password, req.ip);
    const loginResult = await authenticate.user();
    
    const payload = loginResult[0];
    const httpStatus = loginResult[1].httpStatus;

    if(payload.success === true){
        const token = loginResult[1].token;
        res.cookie('token', token, {maxAge: process.env.node_sess_life, httpOnly: true, secure: true});
    }
    
    res.status(httpStatus).json(payload);
});

router.post('/logout', (req, res) =>{
    const authenticate = new authentication(req.query.userName, false);
    authenticate.logout(req.cookies.token);

    res.clearCookie('token');
    res.redirect('/login');
});

router.post('/register', async(req, res) =>{
    const authenticate = new authentication(req.query.userName, req.query.password);
    const registerResult = await authenticate.register();
    res.status(registerResult[1].httpStatus).json(registerResult[0]);
});

router.get('/test', (req, res) => {
    res.status(200).send('testing!!!!');
});

router.get('/test2', (req, res) => {
    res.status(200).send('testing!!!!');
});

module.exports = router;
const express = require('express');
const router = express.Router();
const authentication = require('../controller/authentication.js');

router.get('/', (req, res) =>{

});

router.post('/login', async (req, res) =>{
    
    let returnMsg = 'An error has occured';

    const authenticate = new authentication(req.query.userName, req.query.password);
    const token = await authenticate.user();
    
    if(token !== false){
        res.cookie('token', token, {maxAge: process.env.node_sess_life});
        returnMsg = 'login successful';
    }else{
        returnMsg = 'Invalid Username or password';
    }
    
    res.send(returnMsg);
});

router.post('/logout', (req, res) =>{
    const authenticate = new authentication(req.query.userName, false);
    const token = authenticate.logout();
    res.cookie('token', token, {maxAge: 0});
    res.redirect('/login');
});

router.post('/register', async(req, res) =>{
    const authenticate = new authentication(req.query.userName, req.query.password);
    const registerResult = await authenticate.register();
    res.status(registerResult[1].httpStatus).json(registerResult[0]);
});

module.exports = router;
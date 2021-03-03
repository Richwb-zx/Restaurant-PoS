const express = require('express');
const router = express.Router();
const authentication = require('../controller/authentication.js');
const bcryptjs = require('bcryptjs');

router.get('/', (req, res) =>{

});

router.post('/login', async (req, res) =>{
    
    let returnMsg = 'An error has occured';

    const authenticate = new authentication(req.query.userName, req.query.password);
    const token = await authenticate.user();
    
    if(token !== false){
        const sessLifeMs = process.env.node_sess_life * 1000;
        res.cookie('token', token, {maxAge: sessLifeMs});
        returnMsg = 'login successful';
    }else{
        returnMsg = 'Invalid Username or password';
    }
    
    res.send(returnMsg);
});

router.post('/logout', (req, res) =>{
 
});

router.post('/register', (req, res) =>{
 
});

module.exports = router;
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
 
});

router.post('/register', async(req, res) =>{
    const authenticate = new authentication(req.query.userName, req.query.password);
    const registerResult = await authenticate.register();

    let returnMsg = 'An error occured';
    let returnStatus = false;
    let resStatus = 500;

    if(registerResult === true){
        returnMsg = 'Registration Successful';
        returnStatus = true;
        resStatus = 200;
    }else if(typeof(registerResult) === 'string'){
        returnMsg = registerResult;
        returnStatus = false;
        resStatus = 200;
    }

    res.status(resStatus).json({msg: returnMsg, status: returnStatus});
});

module.exports = router;
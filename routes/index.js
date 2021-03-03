const express = require('express');
const router = express.Router();
const authentication = require('../controller/authentication.js');
const bcryptjs = require('bcryptjs');

router.get('/', (req, res) =>{

});

router.post('/login', async (req, res) =>{
    
    const authenticate = new authentication(req.query.userName, req.query.password);
    await authenticate.user();
});

router.post('/logout', (req, res) =>{
 
});

router.post('/register', (req, res) =>{
 
});

module.exports = router;
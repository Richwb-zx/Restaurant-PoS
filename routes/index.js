const express = require('express');
const router = express.Router();
const authentication = require('../controller/authentication.js');

router.get('/', (req, res) =>{

});

router.post('/login', (req, res) =>{
    const authenticate = new authentication(req.query.userName, req.query.password);
});

router.post('/logout', (req, res) =>{
 
});

router.post('/register', (req, res) =>{
 
});

module.exports = router;
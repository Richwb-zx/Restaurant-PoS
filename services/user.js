const userModel = require('../models/users.js');
const jwt = require('jsonwebtoken');

const User = class User{
    constructor(username, pwHash){
        this.userName = username;
    }

    getUser(){
        return userModel
            .findAll({
                raw: true,
                where: {
                    user_name: this.userName, 
                    active: 1
                },
            })
            .then(result => {
                return (result.length > 0 ? result[0] : false);
            })
            .catch(error => {
                console.log(error);
            });  
    }

    setSession(){
        return jwt.sign(this.userName, process.env.node_sess_secret, {algorithm: "HS256", expiresIn: env.node_sess_life });
    }
}

module.exports = User;
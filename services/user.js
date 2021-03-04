const userModel = require('../models/users.js');
const jwt = require('jsonwebtoken');

const User = class User{
    constructor(username, pwHash){
        this.userName = username;
    }

    getUser(checkActive = true){
        return new Promise ((resolve, reject) => {
            const whereStatement = {user_name: this.userName};

            if(checkActive === true){
                whereStatement.active = 1;
            }

            userModel
                .findAll({
                    raw: true,
                    where: whereStatement,
                })
                .then(result => {
                    console.log(result);
                    return resolve (result.length > 0 ? result[0] : false);
                })
                .catch(error => {
                    return reject(error);
                });  
        });
    }

    setSession(){
        return jwt.sign({username: this.userName}, process.env.node_sess_secret, {algorithm: "HS256", expiresIn: process.env.node_sess_life });
    }
}

module.exports = User;
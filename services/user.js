const userModel = require('../models/users.js');
const {AuthTimeoutModel, knex} = require('../models/authorization_timeout.js');
const jwt = require('jsonwebtoken');

const User = class User{
    constructor(username, ip){
        this.userName = username;
        this.ip = ip;
    }

    async getUser(){
             
        const userQuery = userModel.query().select().where('user_name', this.userName)
        
        return await userQuery
            .then(result => {
                console.log(result);
                const success = (result.length > 0 ? true : false);
                return {response: result[0], success: success, error: false};
            })
            .catch(error => {
                // TODO error handling
                return {success: false, error: true};
            });
    }

    setSession(logout = false){
        const expireTime = (logout === false ? process.env.node_sess_life : 0);
        return jwt.sign({username: this.userName}, process.env.node_sess_secret, {algorithm: "HS256", expiresIn: expireTime });
    }

    async createUser(pwHash){
        return await userModel.query().insert({user_name: this.userName, password: pwHash, active: 1})
                                .then(result => {
                                    return [{response: result, success: true}, {error: false}];
                                })
                                .catch(error => {
                                    const response = [];
                            
                                    const code = (error.nativeError === undefined ? error.code : error.nativeError.code);
                                  
                                    switch(code){
                                        case 'ER_DUP_ENTRY':
                                            response.push({response: 'Username already exists', success: false}, {error: false});
                                            break;
                                        default:
                                            //TODO error handling
                                            response.push({response: 'An Unexpected error has occured, Admin have been notified', success: false}, {error: true});
                                    }

                                    return response;
                                });        
        
    }

    async invalidLogin(userResult){
        console.log('hi');
        const userId = userResult.response.id;      
        //TODO universal date function
        const date = Math.round(Date.now() / 1000);
        

        knex.raw('INSERT INTO `authorization_timeout` (`user_id`, `number_attempts`, `ip_address`,`last_attempt`, `created_on`) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE `number_attempts` = `number_attempts` + 1, `last_attempt` = ?', [userId, 1, this.ip,date,date,date])
        .then(() => {
            return knex.raw('UPDATE users u INNER JOIN authorization_timeout at ON (at.user_id = u.id) SET u.locked=1, u.locked_on=? WHERE at.number_attempts = 3 AND at.user_id=?',[date,userId])
            .then(updateResult => {
                let response = '';
                let success = false;
                if(updateResult[0].changedRows === 1){
                   response = 'Account has been locked, please wait 5 minutes';
                   success = true;
                }

                return {response: response, success: success, error: false};

            }).catch(error2 => {
                //TODO error logging
                console.log(error2);
            });
        })
        .catch(error => {
            //TODO error logging
            console.log(error);
        });


        
    }
}

module.exports = User;
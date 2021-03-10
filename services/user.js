const userModel = require('../models/users.js');
const jwt = require('jsonwebtoken');

const User = class User{
    constructor(username, pwHash){
        this.userName = username;
    }

    async getUser(checkActive = 1, checkLocked = 0){
             
        const userQuery = userModel.query().select().where('user_name', this.userName)

        if(checkActive !== false){
            userQuery.where('active', checkActive);
        }

        if(checkLocked !== false){
            userQuery.where('locked', checkLocked);
        }
        
        return await userQuery
            .then(result => {
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
}

module.exports = User;
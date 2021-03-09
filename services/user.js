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
                const response = (result.length > 0 ? result[0] : false);
                return {response: response, success: true};
            })
            .catch(error => {
                return {response: 'An Unexpected error has occured, Admin have been notified', success: false};
            });
    }

    setSession(logout = false){
        const expireTime = (logout === false ? process.env.node_sess_life : 0);
        return jwt.sign({username: this.userName}, process.env.node_sess_secret, {algorithm: "HS256", expiresIn: expireTime });
    }

    createUser(pwHash){
        
        return userModel
            .create({user_name: this.userName, password: pwHash, active: 1})
            .then(user => {
                return [{msg: 'Your account has been created', status: true},{httpStatus: 200}];
            })
            .catch(error => {
                const returnInfo = [];
                switch(error.errors[0].validatorKey){
                    case 'not_unique':
                        returnInfo.push({msg: 'An Account with this name already exists.', status: false},{httpStatus: 200});
                        break;
                    case 'is_null':
                    default:
                        returnInfo.push({msg: 'An error has occured: Unable to process request, admin have been notified', status: false},{httpStatus:500});
                        break;
                };

                return returnInfo;
            });
    }
}

module.exports = User;
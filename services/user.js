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
                    return resolve (result.length > 0 ? result[0] : false);
                })
                .catch(error => {
                    return reject(error);
                });  
        });
    }

    setSession(logout = false){
        const expireTime = (logout === false ? process.env.node_sess_life : 300);
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
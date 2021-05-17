const user = require('../services/user.js');
const bcryptjs = require('bcryptjs');

const Autentication = class Authentication{
    constructor(account, password, ip){
        this.account = account;
        this.password = password;
        this.ip = ip;
        this.userService = new user(this.account, this.ip);
    }

    async user(){
        let bcryptToken = false;

        const userResult = await this.userService.getUser();
        console.log(userResult);
        if(userResult.error === true || userResult.success === false){
            return [{response: 'An Unexpected error has occured, Admin have been notified', success: false},{httpStatus: 500}];
        }

        if(userResult.response === undefined || userResult.response.active !== 1){
            return [{response:'Incorrect Username or Password.', success: false},{httpStatus: 200}];
        }

        const userData = userResult.response;

        if(userData.locked === 1 && this.userService.processInactiveAccount(userData) === false){
            this.userService.invalidLogin(userResult.response);
            return [{response:'Account is locked.', success: false},{httpStatus: 200}];
        }
        
        bcryptToken = this.bcryptCompare(userData.password);

        if(bcryptToken === false){
            const inValidLoginCheck = await this.userService.invalidLogin(userData);
            
            return [{response: inValidLoginCheck.response, success: false},{httpStatus: 200}];

        }else if(bcryptToken === true){
            const token = await this.userService.setSession(userData.id, userData.authorization_group);
            let response = [];
            if(token !== undefined){
                response = [{response: 'Login Successful', success: true},{token: token,httpStatus: 200}];    
            }else{
                response = [{response: 'An unexpected error has occured, Admin have been notified', success: false},{httpStatus: 500}]
            }

            return response;
        }
    } 

    async register(){
        const pwHash = this.bcryptHash();
        const registerResponse = await this.userService.createUser(pwHash);

        if(registerResponse[1].error === true){
            registerResponse[1].httpStatus = 500;
        }else if(registerResponse[0].success === false){
            registerResponse[1].httpStatus = 200;
        }else if(registerResponse[0].success === true){
            registerResponse[0].response = 'Account created!';
            registerResponse[1].httpStatus = 200;
        }else{
            registerResponse = [{response: 'An Unexpected error has occured, Admin have been notified', success: false}, {error: true, httpStatus: 500}];
        }

        return registerResponse
    }

    logout(token){
        this.userService.logout(token);
    }

    bcryptHash(){
        return bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(13));
    }

    bcryptCompare(pwHash){
        return bcryptjs.compareSync(this.password, pwHash);
    }
}

module.exports = Autentication;
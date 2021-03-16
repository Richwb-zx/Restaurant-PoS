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
       
        if(userResult.error === true){
            return [{response: 'An Unexpected error has occured, Admin have been notified', success: false},{httpStatus: 500}];
        }else if(userResult.success === true){
            bcryptToken = this.bcryptCompare(userResult.response.password);
        }

        if(bcryptToken === false && userResult.response.locked === 0){
            const inValidCheck = await this.userService.invalidLogin(userResult);

            if(inValidCheck.sucess === true){
                return [{response:'Account has been locked.', success: false},{httpStatus: 200}];
            }  

        }else if(userResult.response.locked === 1){
            return [{response:'Account is locked.', success: false},{httpStatus: 200}];
        }else if(userResult.response.active === 1){
            return [{response:'Account is inactive.', success: false},{httpStatus: 200}];
        }

        if(bcryptToken === false || userResult.success === false){
            return [{response:'Incorrect Username or Password.', success: false},{httpStatus: 200}];
        }else if(bcryptToken === true){
            const token = this.userService.setSession();
            return [{response: 'Login Successful', success: true},{token: token,httpStatus: 200}];
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

    logout(){
        return this.userService.setSession(true);
    }

    bcryptHash(){
        return bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(13));
    }

    bcryptCompare(pwHash){
        return bcryptjs.compareSync(this.password, pwHash);
    }

    
    
}

module.exports = Autentication;
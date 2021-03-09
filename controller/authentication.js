const user = require('../services/user.js');
const bcryptjs = require('bcryptjs');

const Autentication = class Authentication{
    constructor(account, password){
        this.account = account;
        this.password = password;
    }

    async user(){
        const loginResult = [];
        let bcryptToken = false;

        const userService = new user(this.account);
        const userResult = await userService.getUser();
        const resultId = userResult.response.id;
        
        if(userResult.success === false){
            return loginResult.push(userResult, {httpStatus: 500});
        }else if(resultId !== undefined){
            bcryptToken = this.bcryptCompare(userResult.response.password);
        }
        
        if(resultId === undefined || bcryptToken === false){
            loginResult.push({response:'Incorrect Username or Password.', success: false},{httpStatus: 200});
        }else if(userResult.success === true && bcryptToken !== false){
            const token = userService.setSession();
            loginResult.push({response: 'Login Successful', success: true},{token: token,httpStatus: 200});
        }else{
            // TODO error logging 
            loginResult.push({response: 'An Unexpected error has occured, Admin have been notified', success: false},{httpsStatus: 500});
        }

        return loginResult;        

    }

    async register(){
        const userService = new user(this.account);
        const pwHash = this.bcryptHash();
        return userService.createUser(pwHash);
    }

    logout(){
        const userService = new user(this.account);
        return userService.setSession(true);
    }

    bcryptHash(){
        return bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(13));
    }

    bcryptCompare(pwHash){
        return bcryptjs.compareSync(this.password, pwHash);
    }

    
    
}

module.exports = Autentication;
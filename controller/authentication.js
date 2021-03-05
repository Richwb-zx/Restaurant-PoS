const user = require('../services/user.js');
const bcryptjs = require('bcryptjs');

const Autentication = class Authentication{
    constructor(account, password){
        this.account = account;
        this.password = password;
    }

    async user(){
        const userService = new user(this.account);
        const userData = await userService.getUser();

        if(!userData || !this.bcryptCompare(userData.password)){
            return false;
        }

        return userService.setSession();
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
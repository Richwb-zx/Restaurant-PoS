const user = require('../services/user.js');

const Autentication = class Authentication{
    constructor(account, password){
        this.account = account;
        this.password = password;
    }

    user(){
        const userService = new user(this.account);
        userService.getUser();
    }

}

module.exports = Autentication;
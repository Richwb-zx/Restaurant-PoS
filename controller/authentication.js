const user = require('../services/user.js');

const Autentication = class Authentication{
    constructor(account, password){
        this.account = account;
        this.password = password;
        console.log(this.account);
    }

    get user(){
        const userService = new user(this.account, this.password);
        userService.authenticate();
    }

}

module.exports = Autentication;
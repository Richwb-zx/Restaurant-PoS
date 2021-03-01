const user = require('../services/user.js');
const bcryptjs = require('bcryptjs');

const Autentication = class Authentication{
    constructor(account, password){
        this.account = account;
        this.password = password;
    }

    user(){
        const userService = new user(this.account);
        userService.getUser();
    }

    bcryptHash(){
        return bcrypt.hashSync(this.password, bcrypt.genSaltSync(13));
    }

    bcryptCompare(pwHash){
        return bcrypt.compareSync(this.password, hash); // true
    }

}

module.exports = Autentication;
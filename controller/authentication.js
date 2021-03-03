const user = require('../services/user.js');
const bcryptjs = require('bcryptjs');

const Autentication = class Authentication{
    constructor(account, password){
        this.account = account;
        this.password = password;
    }

    async user(){
        const userService = new user(this.account);
        const syncGetUser = new Promise((resolve, reject) =>{
            resolve(userService.getUser());
        });
        
        const userData = await syncGetUser
            .then(userData => {
                return userData;
            })
            .catch(error => {
                console.log(error);
            });
        
        if(!userData || !this.bcryptCompare(userData.password)){
            return false;
        }

        return userService.setSession();

    }

    bcryptHash(){
        return bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(13));
    }

    bcryptCompare(pwHash){
        return bcryptjs.compareSync(this.password, pwHash);
    }

    
    
}

module.exports = Autentication;
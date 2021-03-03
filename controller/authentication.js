const user = require('../services/user.js');
const bcryptjs = require('bcryptjs');

const Autentication = class Authentication{
    constructor(account, password){
        this.account = account;
        this.password = password;
    }

    async user(){

        const syncGetUser = new Promise((resolve, reject) =>{
            const userService = new user(this.account);
            resolve(userService.getUser());
        });
        
        const userData = await syncGetUser
            .then(userData => {
                return userData;
            })
            .catch(error => {
                console.log(error);
            });
        
        if(!userData){
            return false;
        }

        const pwCheck = this.bcryptCompare(userData.password);


    }

    bcryptHash(){
        return bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(13));
    }

    bcryptCompare(pwHash){
        return bcryptjs.compareSync(this.password, pwHash);
    }

    
    
}

module.exports = Autentication;
const userModel = require('../models/users.js');

const User = class User{
    constructor(username, password){
        this.userName = username;
        this.password = password;
    }

    async authenticate(){
        return await userModel
            .findAll({
                raw: true,
                where: {
                    user_name: this.userName, 
                    password: this.password, 
                    active: 0
                }
            })
            .then(result => {
                return (result.length > 0 ? true : false);
            })
            .catch(error => {
                console.log(error);
            });  
    }
}

module.exports = User;
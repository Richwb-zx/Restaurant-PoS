const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);
class Users extends Model{
    static get tableName(){
        return 'users';
    }

    async $beforeInsert() {
        this.created_on = this.getDate();
    }

    async $beforeUpdate() {
        const date = this.getDate();
        this.updated_on = date;

        if(this.active !== undefined && this.active === 0){
            this.deactivated_on =date;
        }

        if(this.locked_on !== undefined && this.locked === 1){
            this.locked_on = date;
        }
    }

    getDate(){
        return new Date() / 1000;
    }

   
}





module.exports = Users;
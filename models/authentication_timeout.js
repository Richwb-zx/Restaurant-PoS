const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);

class AuthTimeout extends Model{
    static get tableName(){
        return 'authentication_timeout';
    }

    static get relationMappings() {
        const Users = require('./users.js');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: 'authentication_timeout.user_id',
                    to: 'users.id'
                }
            }
        }
    }

    async $beforeInsert() {
        this.created_on = this.getDate();
    }

    async $beforeUpdate() {
        this.last_attempt = this.getDate(); 
    }

    getDate(){
        return new Date() / 1000;
    }

   
}

module.exports.AuthTimeoutModel = AuthTimeout;
module.exports.knex = knex;
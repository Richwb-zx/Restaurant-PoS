const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);
class Auth_groups extends Model{
    static get tableName(){
        return 'authorization_groups';
    }
}

module.exports = Auth_groups;
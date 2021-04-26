const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);
class RoutesAuth extends Model{
    static get tableName(){
        return 'routes_authorization';
    }
}

module.exports = RoutesAuth;
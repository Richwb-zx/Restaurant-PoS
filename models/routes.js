const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);
class Routes extends Model{
    static get tableName(){
        return 'routes';
    }
}

module.exports = Routes;
const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);
class Routes extends Model{
    static get tableName(){
        return 'routes';
    }

    static get relationMappings() {

        const RoutesAuth = require('./routes_authorization.js');

        return {
            routesauth: {
                relation: Model.HasManyRelation,
                modelClass: RoutesAuth,
                join: {
                    from: 'routes.id',
                    to: 'routes_authorization.route_id'
                }
            }
        }
    }
}

module.exports = Routes;
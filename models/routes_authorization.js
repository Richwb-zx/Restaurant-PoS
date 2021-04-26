const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);
class RoutesAuth extends Model{
    static get tableName(){
        return 'routes_authorization';
    }

    static get relationMappings() {

        const Routes = require('./routes.js');

        return {
            routes: {
                relation: Model.BelongsToOneRelation,
                modelClass: Routes,
                join: {
                    from: 'routes_authorization.route_id',
                    to: 'routes.id'
                }
            }
        }
    }
}

module.exports = RoutesAuth;
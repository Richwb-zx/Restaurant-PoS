const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);
class RoutesAuth extends Model{
    static get tableName(){
        return 'routes_authorization';
    }

    static get relationMappings() {

        const Routes = require('./routes');
        const authGroups = require('./authorization_groups');

        return {
            routes: {
                relation: Model.BelongsToOneRelation,
                modelClass: Routes,
                join: {
                    from: 'routes_authorization.route_id',
                    to: 'routes.id'
                }
            },
            authGroups: {
                relation: Model.BelongsToOneRelation,
                modelClass: authGroups,
                join: {
                    from: 'routes_authorization.group_id',
                    to: 'authorization_groups.id'
                }
            }
        }
    }
}

module.exports = RoutesAuth;
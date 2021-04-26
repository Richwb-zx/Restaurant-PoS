const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);
class Auth_groups extends Model{
    static get tableName(){
        return 'authorization_groups';
    }

    static get relationMappings() {

        const RoutesAuth = require('./routes_authorization');

        return {
            routesAuth: {
                relation: Model.BelongsToOneRelation,
                modelClass: RoutesAuth,
                join: {
                    from: 'authorization_groups.id',
                    to: 'routes_authorization.group_id'
                }
            }
        }
    }
}

module.exports = Auth_groups;
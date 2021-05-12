const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);
class Auth_groups extends Model{
    static get tableName(){
        return 'authorization_groups';
    }

    static get relationMappings() {

        const RoutesAuth = require('./routes_authorization');
        const User = require('./users');

        return {
            routesAuth: {
                relation: Model.BelongsToOneRelation,
                modelClass: RoutesAuth,
                join: {
                    from: 'authorization_groups.id',
                    to: 'routes_authorization.group_id'
                }
            },
            userAuth: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'authorization_groups.id',
                    to: 'users.authorization_group'
                }
            },
            userCreated: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'authorization_groups.created_by',
                    to: 'users.id'
                }
            }
        }
    }
}

module.exports = Auth_groups;
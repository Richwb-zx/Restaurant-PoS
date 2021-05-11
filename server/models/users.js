const { Model } = require('objection');
const knex = require('./connection.js');

Model.knex(knex);
class Users extends Model{
    static get tableName(){
        return 'users';
    }

    static get relationMappings() {

        const AuthTimeout = require('./authentication_timeout');
        const AuthGroups = require('./authorization_groups');
        const RoutesAuth = require('./routes_authorization');

        return {
            authTimeout: {
                relation: Model.BelongsToOneRelation,
                modelClass: AuthTimeout,
                join: {
                    from: 'users.id',
                    to: 'authentication_timeout.user_id'
                }
            },
            authGroup: {
                relation: Model.BelongsToOneRelation,
                modelClass: AuthGroups,
                join: {
                    from: 'users.authorization_group',
                    to: 'authorization_groups.id'
                }
            },
            createdAuthGroups: {
                relation: Model.BelongsToOneRelation,
                modelClass: AuthGroups,
                join: {
                    from: 'users.id',
                    to: 'authorization_groups.created_by'
                }
            },
            routesAuth: {
                relation: Model.BelongsToOneRelation,
                modelClass: RoutesAuth,
                join: {
                    from: 'users.id',
                    to: 'routes_authorization.created_by'
                }
            }
        }
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
        return Math.round(new Date() / 1000);
    } 
}

module.exports = Users;
const config = require('../config/dbconfig.json')(process.env.nodeEnv);

const knex = require('knex')({
    client: config.dialect,
    connection: {
      host : config.host,
      user : config.username,
      password : config.password,
      database : config.database
    }
  });

module.exports = knex;
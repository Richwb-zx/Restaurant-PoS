const Sequelize = require('sequelize');
const dbConfig = require('../config/dbconfig.json');

const dbInfo = dbConfig[process.env.nodeEnv];

 const sequelize = new Sequelize(
                                    dbInfo.database, 
                                    dbInfo.username, 
                                    dbInfo.password, 
                                    {
                                        host: dbInfo.host, 
                                        dialect: dbInfo.dialect, 
                                        logging: false
                                    }
                                );

 module.exports = sequelize;
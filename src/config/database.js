
///	Some convention suggestion

///	Use first Caps with Imports, Class Names
//	small letter / camelCase for variables
//	underscores for functions

import ExpressSessionSql     from 'express-mysql-session'
import { Sequelize }         from 'sequelize'
import { Config }            from './database-config'
import { initialize_models } from '../models/models'

/**
 * Database reference with Sequelize ORM
 * @type {Sequelize}
 */
 export const Database = new Sequelize(
	Config.database, Config.user, Config.password, {
		host   : Config.host,
		port   : Config.port,
		dialect: 'mysql',
		define : {
			timestamps: false
		},
		pool: {
			max    : 16,
			min    : 0,
			acquire: 30000,
			idle   : 10000
		}
	}
);

/**
 * User access session storage used by express
**/

export const SessionStore = new ExpressSessionSql({
	// @ts-ignore
	host                   : Config.host,
	port                   : Config.port,
	user                   : Config.user,
	password               : Config.password,
	database               : Config.database,
	clearExpired           : true,
	checkExpirationInterval: 900000,
	expiration             : 900000
});

/**
 * Initialize the database connection
 * @param {boolean} drop True to drop all tables and re-create
 * @return {Promise} Initialization async handle
 */
export function initialize_database(drop = false) {
	return Database.authenticate()
	.then(onDatabaseConnected)
	.then(initialize_models.bind(this, Database))
	.then(synchronize_database.bind(this, drop))
	.catch(onDatabaseConnectFail);
}

//////////////////////////////////
/////// Private contents /////////
//////////////////////////////////

/**
 * Synchronize database with models
 * @param {boolean} drop True to drop all tables and re-create
 * @private
 */
 async function synchronize_database(drop) {
	try {
		await Database.sync({ force: drop });
		console.log("Database is synchronized with ORM");
		return Promise.resolve();
	 }
	catch(error) {
		console.error("Database failed to synchronized with ORM");
		console.error(error);
		return Promise.reject(error);
	}
}

/**
 * Triggered when database connection is successful
 * @private
 */
function onDatabaseConnected() {
	console.log("Database Connected");
}

/**
 * Triggered when database connection failed
 * @param {Error} error 
 * @private
 */
function onDatabaseConnectFail(error) {
	console.error("Database connection Failed");
	console.error(error);
}
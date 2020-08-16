export { ModelUser  }     from './users'
export { ModelOrder } from './orders'
export { ModelProduct } from './products'

import { ModelUser }      from './users'
import { ModelOrder } from './orders'
import { ModelProduct } from './products'

import { sha256 }                  from 'hash.js'
import { Sequelize, SyncOptions, SequelizeScopeError }  from 'sequelize'
import {productlist} from './productlist';

/**
 * This function initialize models and their relationships for ORM
 * @param {Sequelize} sequelize Database ORM handle
**/
export function initialize_models(sequelize) {
	console.log("Intitializing ORM models");
	try {
		//	Initialize models
		ModelUser.initialize(sequelize);
		ModelOrder.initialize(sequelize);
		ModelProduct.initialize(sequelize);

		console.log("Building ORM model relations and indices");

		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc
		ModelUser.hasMany(ModelOrder, { foreignKey: { name: "uuid"} });
		// ModelOrder.hasMany(ModelProduct, { foreignKey: { name: "uuid_order"} });
			
		console.log("Adding intitialization hooks");
		//	Run once hooks during initialization
		sequelize.addHook("afterBulkSync", generate_root_account.name,  generate_root_account.bind(this, sequelize));
		sequelize.addHook("afterBulkSync", generate_products.name, generate_products.bind(this, sequelize));
		
	}
	catch (error) {
		console.error ("Failed to configure ORM models");
		console.error (error);
	}
}

/**
 * This function creates a root account 
 * @param {Sequelize} sequelize Database ORM handle
 * @param {SyncOptions} options Synchronization options, not used
 */
async function generate_root_account(sequelize, options) {
	//	Remove this callback to ensure it runs only once
	sequelize.removeHook("afterBulkSync", generate_root_account.name);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generating root administrator account");
		/**
		 * @type {import('./users').User}
		 */
		const root_parameters = {	
			uuid : "00000000-0000-0000-0000-000000000000",
			name    : "Ben Zordan",
			email   : "root@mail.com",
			role    : "admin",
			password: sha256().update("P@ssw0rd").digest("hex")
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelUser.findOne({where: { "uuid": root_parameters.uuid }});
		
		account = await ((account) ? account.update(root_parameters): ModelUser.create(root_parameters));
		
		console.log("== Generated root account ==");
		console.log(account.toJSON());
		console.log("============================");
		return Promise.resolve();
	}
	catch (error) {
		console.error ("Failed to generate root administrator user account");
		console.error (error);
		return Promise.reject(error);
	}
}

/**
 * This functions generates products
 * @param {Sequelize} sequelize
 * @param {SyncOptions} options 
 */
async function generate_products(sequelize, options) {
	try {
		sequelize.removeHook("afterBulkSync", generate_products.name);
		console.log("Generating product items");
		//	Clear all products
		const rows_deleted = await ModelProduct.destroy({ where: { } });
		const list_products = await ModelProduct.bulkCreate(productlist);
		console.log(`Deleted ${rows_deleted} dummy product data`);
		console.log(`Inserted ${list_products.length}`);
		return Promise.resolve();
	}
	catch (error) {
		console.log("Failed to generate products");
		console.log(error);
		return Promise.reject(error);
	}
}

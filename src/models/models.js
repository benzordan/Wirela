/**
 * This file is designed to organize all database ORM models.
 * You may perform forward exports on this file.
**/
//	Forward Exporting, so that these classes can be used from this file
//	These can be written as the following, however inteliisense may not work as intended:
//		export import { xxx } from './somepath'
//	It would be wiser to keep them separated.
export { ModelUser  }     from './users'
export { ModelVideo }     from './videos'

import { ModelUser }      from './users'
import { ModelVideo }     from './videos'

//	Additional dependencies required
import { sha256 }                  from 'hash.js'
import { Sequelize, SyncOptions }  from 'sequelize'


/**
 * This function initialize models and their relationships for ORM
 * @param {Sequelize} sequelize Database ORM handle
**/
export function initialize_models(sequelize) {
	console.log("Intitializing ORM models");
	try {
		//	Initialzie models
		ModelUser .initialize(sequelize);
		ModelVideo.initialize(sequelize);

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc
		ModelUser.hasMany(ModelVideo, { foreignKey: { name: "uuid_user" } });
		
		console.log("Adding intitialization hooks");
		//	Run once hooks during initialization
		sequelize.addHook("afterBulkSync", generate_root_account.name,  generate_root_account.bind(this, sequelize));
		// sequelize.addHook("afterBulkSync", generate_videos.name,        generate_videos.bind(this, sequelize));
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
			uuid    : "00000000-0000-0000-0000-000000000000",
			name    : "root",
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
 * This function generates a bunch of dummy videos
 * @param {Sequelize} sequelize Database ORM handle
 * @param {SyncOptions} options Synchronization options, not used
 */
 async function generate_videos(sequelize, options) {
	//	Remove this callback to ensure it runs only once
	sequelize.removeHook("afterBulkSync", generate_videos.name);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generating dummy videos");
		/**
		 * @type {Array<import('./videos').Video>}
		**/
		const parameters = [];
		for (var i = 0; i < 100; ++i) {
			parameters.push({
				title       : `Video ${i.toString().padStart(3, '0')}`,
				dateReleased: new Date(),
				uuid_user   : "00000000-0000-0000-0000-000000000000"
			});
		}
		//	Clear all videos
		const rows_deleted = await ModelVideo.destroy({ where: { } });
		//	Find for existing account with the same id, create or update
		const list_videos = await ModelVideo.bulkCreate(parameters);
		console.log(`Deleted ${rows_deleted} dummy video data`);
		console.log(`Inserted ${list_videos.length}`);
		return Promise.resolve();
	}
	catch (error) {
		console.error ("Failed to generate dummy data for videos");
		console.error (error);
		return Promise.reject(error);
	}
}
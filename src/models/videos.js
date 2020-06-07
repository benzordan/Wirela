import { Sequelize, Model, DataTypes } from 'sequelize'
import { ModelAttributes, InitOptions, UpdateOptions } from 'sequelize'
import { Literal } from 'sequelize/types/lib/utils';
/** 
 * @typedef {import('./structures').Video} Video 
**/

/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for storing Videos
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
 * @implements {Video}
 */
export class ModelVideo extends Model {

	/**
	 * Initializer of the model
	 * @access public
	 * @see Model.init
	 * @param   {Sequelize} sequelize The configured Sequelize handle
	**/
	static initialize(sequelize) {
		ModelVideo.init(ModelVideo._columns(), ModelVideo._table_options(sequelize));
	}
	
	/**
	 * @access private
	 * @return {ModelAttributes} Column attributes required to build tables
	 **/
	static _columns() {
			return {
			"uuid"          : { type: DataTypes.CHAR(36),     primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated"   : { type: DataTypes.DATE(),       allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateUpdated"   : { type: DataTypes.DATE(),       allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateReleased"  : { type: DataTypes.DATE(),       allowNull: false },
			"title"         : { type: DataTypes.STRING(64),   allowNull: false },
			"subtitle"      : { type: DataTypes.STRING(64),   allowNull: false, defaultValue: "N.A" },
			"story"         : { type: DataTypes.STRING(4096), allowNull: false, defaultValue: "" },
			"language"      : { type: DataTypes.STRING(128),  allowNull: false, defaultValue: "" },
			"classification": { type: DataTypes.STRING(128),  allowNull: false, defaultValue: "" }
		};
	}

	/**
	 * @access private
	 * @param  {Sequelize} sequelize The configured Sequelize handle
	 * @return {InitOptions} Initialization options
	 **/
	static _table_options(sequelize) {
		return {
			"sequelize": sequelize,
			"tableName": "videos",
			"hooks"    : {
				"afterUpdate": ModelVideo._auto_update_timestamp
			}
		};
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @access private
	 * @param {ModelVideo}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	 */
	 static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}

	
	//////////////////
	//// Optional ////
	//////////////////

	/** 
	 * @override
	 * @returns {{}}} The json representation of this entity
	 **/
	toJSON()     { return super.toJSON(); }

	/** 
	 * Shorthand for obtaining typed attribute access with typescript definitions
	 * @returns {Video} 
	 **/
	 // @ts-ignore
	 get data()  { return this.get(); }

};
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

	 
	//	The long hassle way of defining properties for 
	//	Intellisense to work. Otherwise check out structures.d.ts
	//	and type definitions to allow intellisense magic to occur.
	//////////////////////
	///// Properties /////
	//////////////////////

	/** @type {string} **/
	get uuid() { return super.get("uuid"); }
	/** @type {Date}   **/
	get dateCreated()  { return super.get("dateCreated"); }
	/** @type {Date}   **/
	get dateUpdated()  { return super.get("dateUpdated"); }
	/** @type {Date}   **/
	get dateReleased() { return super.get("dateReleased"); }

	/** @type {string} **/
	get title() { return super.get("title"); }

	/** @type {string} **/
	get subtitle() { return super.get("subtitle"); }

	/** @type {string} **/
	get story() { return super.get("story"); }

	/** @type {string} **/
	get language() { return super.get("language"); }

	/** @type {string} **/
	get classification() { return super.get("classification"); }

	/** @param {string} value **/
	set uuid(value) { super.set("uuid", value); }
	/** @param {Date}   value **/
	set dateCreated(value) { super.set("dateCreated", value); }
	/** @param {Date}   value **/
	set dateUpdated(value) { super.set("dateUpdated", value); }
	/** @param {Date}   value **/
	set dateReleased(value) { super.set("dateReleased", value); }

	/** @param {string} value **/
	set title(value) { super.set("title", value); }

	/** @param {string} value **/
	set subtitle(value) { super.set("subtitle", value); }

	/** @param {string} value **/
	set story(value) { super.set("story", value); }

	/** @param {string} value **/
	set language(value) { super.set("language", value); }

	/** @param {string} value **/
	set classification(value) { super.set("classification", value); }
};
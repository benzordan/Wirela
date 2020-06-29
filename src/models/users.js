import { Sequelize, Model, DataTypes } from 'sequelize'
import { ModelAttributes, InitOptions, UpdateOptions } from 'sequelize'
/** 
 * @typedef {import('./structures').User} User
**/

/**
 * For enumeration use
**/
export class UserRole {
	static get Admin() { return "admin"; }
	static get User()  { return "user";  }
}

export class ModelUser extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} sequelize The configured Sequelize handle
	**/
	static initialize(sequelize) {
		ModelUser.init(ModelUser._columns(), ModelUser._table_options(sequelize));
		// ModelUser.afterUpdate(ModelUser._auto_update_timestamp.name, ModelUser._auto_update_timestamp);
	}

	/**
	 * @access private
	 * @return {ModelAttributes} Column attributes required to build tables
	 **/
	static _columns() {
			return {
				"uuid-user"       : { type: DataTypes.CHAR(36),    primaryKey: true, defaultValue: DataTypes.UUIDV4 },
				"dateCreated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
				"dateUpdated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
				"name"       : { type: DataTypes.STRING(64),  allowNull: false },
				"email"      : { type: DataTypes.STRING(128), allowNull: false },
				"password"   : { type: DataTypes.STRING(64),  allowNull: false },
				"role"       : { type: DataTypes.ENUM(UserRole.User, UserRole.Admin), defaultValue: UserRole.User, allowNull: false }
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
			"tableName": "users",
			"hooks"    : {
				"afterUpdate": ModelUser._auto_update_timestamp
			}
		};
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelUser}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
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
	toJSON()    { return super.toJSON(); }

	/** 
	 * Shorthand for obtaining typed attribute access with typescript definitions
	 * @returns {User} 
	 **/
	 get data()  { return this; }


	//	The long hassle way of defining properties for 
	//	Intellisense to work. Otherwise check out structures.d.ts
	//	and type definitions to allow intellisense magic to occur.
	//////////////////////
	///// Properties /////
	//////////////////////

	/** @type {string} **/
	get uuid() { return super.get("uuid"); }
	/** @type {Date}   **/
	get dateCreated() { return super.get("dateCreated"); }
	/** @type {Date}   **/
	get dateUpdated() { return super.get("dateUpdated"); }
	/** @type {string} **/
	get name() { return super.get("name"); }
	/** @type {string} **/
	get email() { return super.get("email"); }
	/** @type {string} **/
	get password() { return super.get("password"); }
	/** @type {string} **/
	get role() { return super.get("role");}

	/** @param {string} value **/
	set uuid(value) { super.set("uuid", value); }
	/** @param {Date}   value **/
	set dateCreated(value) { super.set("dateCreated", value); }
	/** @param {Date}   value **/
	set dateUpdated(value) { super.set("dateUpdated", value); }
	/** @param {string} value **/
	set name(value) { super.set("name", value); }
	/** @param {string} value **/
	set email(value) { super.set("email", value); }
	/** @param {string} value **/
	set password(value) { super.set("password", value); }
	/** @param {string} value **/
	set role(value) { super.set("role", value);}
};
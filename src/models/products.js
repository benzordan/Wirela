import { Sequelize, Model, DataTypes } from 'sequelize'
import { ModelAttributes, InitOptions } from 'sequelize'
/** 
 * @typedef {import('./structures').Product} Product 
**/

/**
 * @implements {Model}
 */

export class ModelProduct extends Model {

	/**
	 * Initializer of the model
	 * @access public
	 * @see Model.init
	 * @param   {Sequelize} sequelize The configured Sequelize handle
	**/
	static initialize(sequelize) {
		ModelProduct.init(ModelProduct._columns(), ModelProduct._table_options(sequelize));
	}
	
	/**
	 * @access private
	 * @return {ModelAttributes} Column attributes required to build tables
	 **/
	static _columns() {
			return {
                "uuid": {type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4},
				"name": { type: DataTypes.STRING(64), allowNull: false, },
				"category": {type: DataTypes.STRING(32),allowNull: false},
				"description": {type: DataTypes.STRING(4096), allowNull: false, defaultValue: "N.A"},
                "quantity": { type: DataTypes.INTEGER(12), allowNull: false},
				"price": { type:DataTypes.DECIMAL(10, 2), allowNull: false},
				"urlImage": { type: DataTypes.STRING, allowNull: false, defaultValue: "/img/no-image.jpg"}
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
			"tableName": "products",
		};
    }
    
	/** 
	 * @override
	 * @returns {{}} } The json representation of this entity
	 **/
	toJSON()     { return super.toJSON(); }

	/** 
	 * Shorthand for obtaining typed attribute access with typescript definitions
	 * @returns {Product} 
	 **/
	 // @ts-ignore
	get data()  { return this.get(); }

};
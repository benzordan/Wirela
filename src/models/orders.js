import {Sequelize, Model, DataTypes} from 'sequelize';
import { ModelAttributes, InitOptions, UpdateOptions } from 'sequelize'

/**
 * @typedef {import('./structures').Order} Order
 */

export class ModelOrder extends Model {

    static initialize(sequelize) {
        ModelOrder.init(ModelOrder._columns(), ModelOrder._table_options(sequelize));
    }

    /** 
     * 
     *  @access private 
     *  @return {ModelAttributes} returns specified attributes from column
     */
    static _columns() {
        return {
            "orderID": { type: DataTypes.CHAR(36),    primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            "orderDate": { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "name": { type: DataTypes.STRING(), allowNull: false, defaultValue: ""},
            "price": { type:DataTypes.DECIMAL(10, 2), allowNull: false},
            "product": { type: DataTypes.STRING(64), allowNull: false, },
            "quantity": { type: DataTypes.INTEGER(12), allowNull: false},
        }
    }

    /**
     *  @access private
     *  @param {Sequelize} sequelize 
     *  @return {InitOptions}
     */

    static _table_options(sequelize) {
        return {
            "sequelize": sequelize,
            "tableName": "orders",
        }
    }

    /**
     * @override
     * @returns {{}} represents order entity in json format
     */
    toJSON() { return super.toJSON(); }

    /**
     * @returns {Order}
     */
    get data() { return this.get(); }
}; 
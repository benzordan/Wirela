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
            "orderID": { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: ""},
            "orderDate": { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "name": { type: DataTypes.STRING(), allowNull: false, defaultValue: ""},
            "address": { type: DataTypes.STRING(), allowNull: false, defaultValue: ""},
            "phone": {type: DataTypes.STRING(), allowNull: false, defaultValue: ""},
            "email": { type: DataTypes.STRING(), allowNull: false, defaultValue: ""},
            "totalPrice": { type: DataTypes.CHAR, allowNull: false, defaultValue: ""}
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
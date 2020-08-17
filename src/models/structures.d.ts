/**
 * @file This file contains data structures used for type hints
 * Type hint structures related to database contents should be placed here.
 * You may perform an forward export if you prefer. However, avoid using filenames that
 * are identical to .js files. Intellisense isn't that good to differenciate.
**/

import { Model } from "sequelize/types";

/**
 * This structure represents a user stored in the database.
**/
 export interface User {
	uuid?       : string;
	dateCreated?: Date;
	dateUpdated?: Date;
	name?       : string;
	email?      : string;
	/**
	 * The SHA256 hashed password
	 */
	password?: string;
	/**
	 * The assigned user role
	 */
	role?: string;
}

/**
 * This structure represents a product stored in the database
 */
export interface Product {
	uuid_product? : string;
	name? : string;
	category? : string;
	description? : string;
	quantity? : integer;
	price? : integer;
}
/** 
 This structure represents an order stored in the database
**/
export interface Order {
	orderId? : string;
	orderDate? : Date;
	product?: string;
	quantity?: number;
	price?: string;
	name?: string;
}
/**
 * @file This file contains data structures used for type hints
 * Type hint structures related to database contents should be placed here.
 * You may perform an forward export if you prefer. However, avoid using filenames that
 * are identical to .js files. Intellisense isn't that good to differenciate.
**/

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
 * This structure represents a video stored in the database.
**/
 export interface Video {
	uuid?          : string;
	dateCreated?   : Date;
	dateUpdated?   : Date;
	dateReleased?  : Date;
	title?         : string;
	subtitle?      : string;
	story?         : string;
	language?      : string;
	classification?: string;
}
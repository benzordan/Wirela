import { sha256 }                   from 'hash.js'
import { PassportStatic }           from 'passport'
import { Strategy, VerifyFunction } from 'passport-local'
import { ModelUser }                from '../models/models'

/**
 * Configure passport
 * @param {PassportStatic} passport 
 */
export function initialize_passport(passport) {
	passport.use(LocalStrategy);
	passport.serializeUser(serialize_user);
	passport.deserializeUser(deserialize_user);
}

const LocalStrategy = new Strategy(
	{ usernameField: "email" },
	verify_request
);

/**
 * The request verification callback function.
 * @type {VerifyFunction}
 */
async function verify_request(username, password, done) {
	try {
		if (!username || !password) {
			console.error("Malformed incoming request");
			return done(null, false, { message: "Malformed request. Please ensure the required fields are filled up."});
		}

		//	Hash.js don't have Salting...
		const hpassword = sha256().update(password).digest("hex");
		const user      = await ModelUser.findOne({ where: { "email" : username, "password": hpassword }});
		
		if (user) {
			console.log("Login credentials verified");
			return done(null, user);
		}
		else {
			console.error("Login credientials mismatched");
			console.error(`Hash: ${hpassword} vs ${user.password}`);
			return done(null, false, { message: "Invalid credentials" });
		}
	}
	catch (error) {
		console.error("Failed to verify user credentials");
		console.error(`User: ${username} Password: ${password}`);
		console.error(error);
		return done(null, false, { message : "Invalid User"});
	}
}

/**
 * 
 * @param {ModelUser} user 
 * @param {err: Error, id?: string)} done 
**/
function serialize_user(user, done) {
	done(null, user.uuid-user);
}

/**
 * 
 * @param {ModelUser} user 
 * @param {err: Error, id?: ModelUser)} done 
**/

async function deserialize_user(userId, done) {
	try {
		const user = await ModelUser.findByPk(userId);
		done(null, user);
	}
	catch(error) {
		console.error("Failed to deserialize user");
		console.error(error);
	}
}
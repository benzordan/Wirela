import Passport from 'passport'
import { sha256 } from 'hash.js'
import { Router, Request, Response, NextFunction } from 'express';
import { ModelUser }                 from '../models/models'
import { flash_message, FlashType }  from '../helpers/flash-messenger';
import { UserRole } from '../models/users';

const router = Router();

router.get('/login',    handle_login);
router.get('/register', handle_register);

router.post('/login',    handle_login_submit);
router.post('/register', handle_register_submit);
router.all('/logout',    handle_logout);

module.exports = router;

/**
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
function handle_logout(request, response) {
	request.logout();
	response.redirect('/');
}

/**
 * Displays the page for registration
 * @param {Request} request 
 * @param {Response} response 
 */
function handle_register(request, response) {
	response.render("user/register", {
		"pageCSS": "/css/user/register.css"
	});
}

/**
 * Handles registeration request
 * @param {Request} request 
 * @param {Response} response 
 */
async function handle_register_submit(request, response) {
	console.log("Incoming Request");
	console.log(request.body);

	//	Check out this link
	// 	https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
	//	You can split this for more detailed message but for simplicity
	const fmtPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

	/** 
	 * List of errors.
	 * @type {[{message: string}]} 
	 **/
	const errors = [];
	if (request.body["email"] === undefined)
		errors.push({message: "Email is mandatory"});
	if (request.body["name"] === undefined)
		errors.push({message: "Please provide a name"});
	if (request.body["password"] !== request.body["password2"])
		errors.push({message: "Mismatched password"});

	if (!fmtPassword.test(request.body["password"])) {
		errors.push({message: "Password must contain at least 1 lower, 1 upper, 1 numeric and 1 special character. Minimum size of 8"});
	}


	try {
		if (await ModelUser.count({ where: { "email" : request.body["email"] }}))
			errors.push({message: "This email address have already been used!"});
	}
	catch(error) {
		console.error("Unexpected error");
		console.error(error);
		return	response.status(500);
	}
	
	//	So if got error we just re-draw page with error messages
	if (errors.length > 0) {
		response.render("user/register", {
			"alert_failure": "Unable to register user. See error messages.",
			"errors"       : errors,
			"data"         : request.body
		});
	}
	//	Redirect to login or you can just show a "Thank you page etc"
	//	Depends on how you want your users to feel
	else {

		try {
			await ModelUser.create({
				email   : request.body["email"],
				name    : request.body["name"],
				password: sha256().update(request.body["password"]).digest("hex"),
				role    : UserRole.User
			});
		}
		catch (error) {
			console.error("Unexpected error");
			console.error(error);
			return	response.status(500);
		}

		flash_message(response, 
			FlashType.Success, 
			`${request.body["email"]} registered successfully. Please login.`, 
			"fas fa-sign-in-alt", 
			true);

			return response.redirect("/"
			//"alert_success": `${request.body["email"]} registered successfully.`
		);
	}
}

/**
 * Displays the page for login
 * @param {Request} request 
 * @param {Response} response 
 */
function handle_login(request, response) {
	response.render("user/login", {
		"pageCSS": "/css/user/login.css"
	});
}

/**
 * Handles submission of login request
 * @param {Request} req
 * @param {Response} res
 *
 */
function handle_login_submit(req, res, next) {
	console.log("Incoming Request");
	console.log(req.body);

	return Passport.authenticate('local', {failureFlash: 'Invalid username or password.'},function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { flash_message(res, FlashType.Warn, `Invalid Credentials`, 
			"fas fa-sign-in-alt", 
			true);
			return res.redirect('/auth/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            if (user.role === UserRole.Admin)
                return res.redirect('/dashboard');
            else 
                return res.redirect('/')
        });
    })(req, res, next);
}

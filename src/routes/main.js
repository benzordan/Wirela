import { Router, Request, Response } from 'express'
import { flash_message, FlashType  } from '../helpers/flash-messenger'
import { ModelUser } from '../../build/models/users';


// import flash_message from "../helpers/messenger"

//	Either of these 3 patterns
// const alertMessage = require(".....");
// import alertMessage from '....'
// import { flash_message, FlashType  } from '../helpers/FlashMessenger'

//	A definition or declaration
// const xxxx = something;	
// console.log(xxxx);	//	undefined

/**
 * Configure router parameters
 * @see "http://expressjs.com/en/5x/api.html#express.router"
 */
const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false    //	Whether we should strictly differenciate "/home/" and "/home"
});

/**
 * Your base routes
 */
router.get('/',      page_home);
router.get('/about', page_about);
/**
 * Subroutes to be added here
 */
router.use('/auth',      require('./auth'));
router.use('/video',     require('./video'));
router.use('/admin',     require('./admin/admin'));
//	This route contains examples
router.use('/examples',  require('./examples/examples'));
module.exports = router;

/**
 * Renders the home page
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
function page_home(req, res) {
	res.render('index', {
		"title": 'Video Jotter'
	});
}

/**
 * Renders the about page
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
function page_about(req, res) {

	//	Alert messengers
	flash_message(res, FlashType.Success, "This is an Success message", "fas fa-sign-in-alt",        true);
	flash_message(res, FlashType.Warn,    "This is an Warning message", "fas fa-exclamation-circle", true);

	//	Standard rendering stuff
	res.render('about', {
		"pageJS": [
			"/js/extra.js"
		],
		"alert_success": "Example success message",
		"alert_failure": "Example failure message",
		"errors"       : [
			{ "message": "Error message 0" },
			{ "message": "Error message 1" },
			{ "message": "Error message 2" },
			{ "message": "Error message 3" },
			{ "message": "Error message 4" }
		]
	});
}
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
router.get('/catalog', page_catalog);
/**
 * Subroutes to be added here
 */
router.use('/auth',      require('./auth'));
router.use('/admin',     require('./admin/admin'));
router.use('/cart', 	 require('./cart'));
//	This route contains examples
router.use('/examples',  require('./examples/examples'));
module.exports = router;

function page_catalog(req, res) {
	res.render('catalog', {
		products: products,
		"pageCSS": "/css/user/catalog.css"
	})
}

/**
 * Renders the home page
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
function page_home(req, res) {
	res.render('index', {
		"title": 'wirela - electronics purveyor',
		"pageCSS": "/css/user/main.css"
	});
}
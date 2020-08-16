import { Router, Request, Response } from 'express'
/**
 * Configure router parameters
 * @see "http://expressjs.com/en/5x/api.html#express.router"
 */
const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false    //	Whether we should strictly differenciate "/home/" and "/home"
});

router.get('/manage-products',   page_manage_products);
router.get("/manage-users",      page_manage_users);
module.exports = router;

/**
 * 
 * @param {Request}  request  Incoming HTTP Request
 * @param {Response} response Outgoing HTTP Response
 */
function page_manage_products(request, response) {
	response.status(200).json({
		"message": "okay"
	});
}
/**
 * 
 * @param {Request}  request  Incoming HTTP Request
 * @param {Response} response Outgoing HTTP Response
 */
function page_manage_users(request, response) {
	response.status(200).json({
		"message": "okay"
	});
}
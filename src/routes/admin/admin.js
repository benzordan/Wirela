import { Router, Request, Response, NextFunction } from 'express'
import { UserRole } from '../../../build/models/users';

/**
 * Configure router parameters
 * @see "http://expressjs.com/en/5x/api.html#express.router"
 */
const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false    //	Whether we should strictly differenciate "/home/" and "/home"
});

router.use('/services',          authorizer, require("./services/services"));
router.get('/manage-products',   authorizer, page_manage_products);
router.get("/manage-users",      authorizer, page_manage_users);
module.exports = router;

/**
 * 
 * @param {Request} request 
 * @param {Response} response 
 * @param {NextFunction} next 
 */
function authorizer(request, response, next) {
	if (request.user.role === UserRole.Admin)
		return next();
	else
		return response.status(403);
}

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
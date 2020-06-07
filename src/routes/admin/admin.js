import { Router, Request, Response, NextFunction } from 'express'
import { UserRole } from '../../../build/models/users';
import { ModelOrder } from '../../models/orders';

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
 * 
 * ==================
 * Admin Order Routes
 * ==================
 * /admin/orders
 * /admin/orders/:orderId
 * ===================
 */

router.use('/services',          authorizer, require("./services/services"));
router.get('/manage-products',   authorizer, page_manage_products);
router.get("/manage-users",      authorizer, page_manage_users);

// Admin Order Routes
router.get('/orders', page_order_list)
router.get('/orders/:orderId', page_order_item)
module.exports = router;

/**
 * 
 * @param {Request} request 
 * @param {Response} response 
 * @param {NextFunction} next 
 */

// Modify the authorizer so that it checks if the user role is a staff
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

// /admin/orders
// findAll params
// res.render() params
/**
 * @param {Request} request Incoming HTTP Request
 * @param {Response} response Outgoing HTTP 
 */
async function page_order_list(req, res) {
	try {
		const videos = await ModelOrder.findAll({
			raw: true
		})
		return res.render('staff/orderList', {
			videos: videos
		})
	}
	catch (error) {
		console.error("failed to retrieve orders")
		console.error(error);
		return res.status(500).end();
	}
}

// /admin/order/:orderId
// res.render() params
/**
 * @param {Request} request 
 * @param {Response} response 
 */
async function page_order_item(req, res) {
	try {
		const order = ModelOrder.findOne({
			where: {"orderId": req.params["orderId"]}
		});
		if (order) {
			return res.render('staff/orders/indvOrder', {
				order: order
			})
		}
		else {
			console.error(`Failed to retrieve video ${req.params["orderId"]}`);
			console.error(error);
			return res.status(410).end()
		}
	}
	catch {
		console.error(`Failed to retrieve video ${req.params["orderId"]}`);
		console.error(error);
		return res.status(500).end();
	}
}

import { Router, Request, Response, NextFunction } from 'express'
import { UserRole, ModelOrder, ModelUser } from '../../models/models';
import { flash_message, FlashType  } from '../../helpers/flash-messenger';
import  productController from '../../controller/productController';
import { getPagination, getPagingData } from '../../controller/paginationController';
import { upload, remove_file, imageUrl} from '../../helpers/imageUpload';
import { Op } from 'sequelize';

const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false    //	Whether we should strictly differenciate "/home/" and "/home"
});

/**
 * Sub-routes
 */
router.use('/product',     require('./services/products'));

// Admin Order Routes
router.get('/orders', page_order_list)
router.get('/orders/:orderId', page_order_item)
router.get('/invoice', page_invoice)
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

// /admin/orders
// findAll params
// res.render() params
/**
 * @param {Request} request Incoming HTTP Request
 * @param {Response} response Outgoing HTTP 
 */

async function page_order_list(req, res) {
	try {
		const orders = await ModelOrder.findAll({
			order: [
				["name", "ASC"]
			],
			raw: true
		})
		return res.render('staff/orders/orderList', {
			layout: "staff",
			pageCSS: "/css/staff/....",
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
		console.error(`Failed to retrieve order ${req.params["orderId"]}`);
		console.error(error);
		return res.status(500).end();
	}
}
async function page_invoice(req, res) {
	try {
		const content = await ModelUser.findOne({
			// Find a product according to req.params["uuid"]
	});
		if (content) {
			return res.render('staff/orders/invoice', {
				title: "wirela staff: invoice",
				layout: "staff",
				"content": content,
			});
		}
		else {
			console.error(`Failed to retrieve product ${req.params["uuidProduct"]}`);
			console.error("error");
			return res.status(410).end();
		}
	} catch (error) {
		console.log("Internal server error")
		console.error(error)
		return res.status(500).end()
	}
}


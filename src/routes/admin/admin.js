import { Router, Request, Response, NextFunction } from 'express'
import { UserRole, ModelOrder, ModelProduct  } from '../../models/models';
import { Model } from 'sequelize/types';

const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false   
});

// Admin Product Routes
// Retrieve
router.get('/list-products', page_list_products);
// Create
router.get('/create-product', page_create_product);
router.put('/create-product', handle_create_product);
// Update/Delete
router.get('/update-product/:uuid', page_update_product);
router.patch('/update/:uuid', handle_update_product);
router.delete("/delete/:uuid", handle_delete_product);

// Admin Order Routes
router.get('/list-orders', page_order_list);
router.get('/orders/:orderId', page_order_item);
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
 * This function displays the list of orders that are stored in the database
 * @param {Request} request Incoming HTTP Request
 * @param {Response} response Outgoing HTTP 
 */
async function page_order_list(req, res) {
	try {
		const videos = await ModelOrder.findAll({
			order: [
				["name", "ASC"]
			],
			raw: true
		})
		return res.render('staff/orders/orderList', {
			layout: "staff",
			pageCSS: "/css/staff/....",
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
 * This function retrieves the individual order that are stored in the database
 * @param {Request} request 
 * @param {Response} response 
 */
async function page_order_item(req, res) {

	try {
		const order = ModelOrder.findOne({
			where: {"uuid-order": req.params["uuid-order"]}
		});
		if (order) {
			return res.render('staff/orders/indvOrder', {
				layout: "staff",
				order: order
			})
		}
		else {
			console.error(`Failed to retrieve order ${req.params["orderId"]}`);
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

/**
 * This function displays the list of products in that has been created
 * @param {Request} request
 * @param {Response} response
 */
async function page_list_products(req, res) {
	try {
		const products = await ModelProduct.findAll({
			raw: true
		})
		return res.render('staff/products/productList', {
			layout: "staff",
			products: products
		})
	} 
	catch (error) {
		console.error("Failed to retrieve products from database");
		console.error(error);
		return res.status(500).end();
	}
}

/**
 * This function displays the page to create a product
 * @param {Request} req 
 * @param {Response} res 
 */

function page_create_product(req, res) {
	return res.render('staff/products/createProduct', {
		layout: "staff",
		mode: "create",
		content: {}
	})
}

/**
 * This function retrieves user input and instantiates a product into the database
 * @param {Request} req 
 * @param {Response} res 
 */

async function handle_create_product(req, res) {
	// Validate user input here 
	// try {
		
	// } 
	// catch {
	// 	return res.status(400).end();
	// }
	try {
		const new_product = await ModelProduct.create({
			"name"    : req.body["name"],
			"desc"    : req.body["desc"],
			"quantity": req.body["quantity"],
			"price"   : req.body["price"]
		});

		return res.redirect("/admin/list-products");
	}
	catch (error) {
		console.error("Failed to create product")
		console.error(error);
		return res.status(500).end();
	}
}
/**
 * This function updates the attributes of the products that has been stored in the database
 * @param {Request} req 
 * @param {Response} res 
 */
 async function page_update_product(req, res) {
	// Validate the user input
	try {
		const content = await ModelProduct.findOne({where: { "product-uuid": req.params["product-uuid"] }});
		if (content) {
			return res.render('staff/products/createProduct', {
				layout: "staff",
				"mode"   : "update",
				"content": content
			});
		}
		else {
			console.error(`Failed to retrieve product ${req.params["uuid"]}`);
			console.error(error);
			return res.status(410).end();
		}
	}
	catch (error) {
		console.error(`Failed to retrieve product ${req.params["uuid"]}`);
		console.error(error);
		return res.status(500).end();
	}
}

/**
 * This function finds the product in the database and update it's contents
 * @param {Request} res 
 * @param {Response} req 
 */
async function handle_update_product(res, req) {
	// Add try and catch block to handle error
	try {
		const contents = await ModelProduct.findAll({where: { "uuid": req.params["uuid"]}})
		switch (contents.length) {
			case 0      : return res.redirect(410, "/admin/list-products")
			case 1      : break;
				default: return res.status(409, "/admin/list-products")
		}
		//	Ignore the uuid
		delete req.body["uuid"];

		await (await contents[0].update(req.body)).save();
		
		flash_message(res, FlashType.Success, "Product updated");
		return res.redirect(`/admin/list-products/${req.params["uuid"]}`);
	}
	catch (error) {
		console.error("Failed to update product");
		console.error("error");
		return res.status(500).end();
	}
}

/**
 * This functions deletes the product from the database
 * @param {Request} res 
 * @param {Response} req 
 */

async function handle_delete_product(res, req) {

	// Authorization: check if admin can delete product user  
	try {
		const affected = await ModelVideo.destroy({where: { "uuid": req.params["uuid"]}});
		if (affected == 1) {
			console.log(`Deleted product: ${req.params["uuid"]}`);
			return res.redirect("/admin/list-products");
		}
		else {
			console.error(`More than one entries affected by: ${req.params["uuid"]}, Total: ${affected}`);
			return res.status(409);
		}
	}
	catch (error) {
		console.error(`Failed to delete video: ${req.params["uuid"]}`);
		console.error(error);
		return res.status(500).end();
	}
}
import { Router, Request, Response, NextFunction } from 'express'
import { UserRole, ModelOrder, ModelProduct  } from '../../models/models';
import { flash_message, FlashType  } from '../../helpers/flash-messenger';
import  productController from '../../controller/productController';
import { getPagination, getPagingData } from '../../controller/paginationController';
import { upload, remove_file, imageUrl} from '../../helpers/imageUpload';
import { Op } from 'sequelize';
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

// Admin Product Routes

// Retrieve
router.get('/list-products/', page_list_products);
router.get('/list-products/:uuidProduct', page_list_productitem);
// Create
router.get('/create-product', page_create_product);
router.put('/create-product', upload.single("productUpload"), handle_create_product);
router.get('/download', productController.download);
// Update/Delete
router.get('/update-product/:uuidProduct', page_update_product);
router.patch('/update-product/:uuidProduct', upload.single("productUpload"),handle_update_product);
router.delete("/delete/:uuidProduct", handle_delete_product);
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

/**
 * This function displays the list of products stored in the database
 * @param {Request} request
 * @param {Response} response
 */
async function page_list_products(req, res) {
	// Set pagination attributes
	var size = 10;
	const { page, search } = req.query;
	console.log(search)
	const { limit, offset } = getPagination(page, size)
	try {
		const products = await ModelProduct.findAndCountAll({limit:limit, offset:offset})
		var totalProduct = await ModelProduct.count()
		var data = getPagingData(products, page, limit)
		// If there is a search query, find the product that user searched for
		if (search) {
			const foundProducts = await ModelProduct.findAndCountAll({
				where: {
					name: {
						[Op.like]: '%' + search + '%'
					}
				},
				limit: limit,
				offset: offset
			})
			var data = getPagingData(foundProducts, page, limit);
			console.log("size: ", data.productCount)
			console.log("total items: ", totalProduct)
			console.log("total pages: ", data.totalPages);
			console.log("current page: ", data.currentPage);
		}
		return res.render('staff/products/productList', {
			title: "wirela staff: product list",
			layout: "staff",
			products: data.products,
			numOfProducts: data.productCount,
			totalItems: totalProduct,
			currentPage: data.currentPage,
			totalPages: data.totalPages,
			pageCSS: "/css/staff/prodlist.css",
			pageJS: "/js/staff/products.js"
		})
	} 
	catch (error) {
		console.error("Failed to retrieve products from database");
		console.error(error);
		return res.status(500).end();
	}
}
/**
 * This function displays the page for each individual items
 * @param {Request} req 
 * @param {Response} res 
 */
async function page_list_productitem(req, res) {
	try {
		const content = await ModelProduct.findOne({
			// Find a product according to req.params["uuid"]
			where: { "uuidProduct": req.params["uuidProduct"] },
	});
		if (content) {
			return res.render('staff/products/productDetail', {
				title: "wirela staff: product detail",
				layout: "staff",
				"content": content,
				pageCSS: "/css/staff/proddesc.css"
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

/**
 * This function displays the page to create a product
 * @param {Request} req 
 * @param {Response} res 
 */

function page_create_product(req, res) {
	return res.render('staff/products/createProduct', {
		title: "wirela staff: create product",
		layout: "staff",
		mode: "create",
		content: {}
	})
}


/**
 * This function retrieves user input and creates a product object
 * @param {Request} req 
 * @param {Response} res 
 */

async function handle_create_product(req, res) {
	console.log("Incoming request")
	// Return a 400 error if no file is selected
	if (req.file === undefined && req.body["productURL"] === undefined) {
		return res.status(400).end()
	}
	var errors = [];
	if (errors.length > 0) {
		res.render("staff/products/createProduct", {
			layout : "staff",
			mode: "create",
			"errors": errors,
			content : req.body
		})
	} else {
		try {
			// Create a product based on the database model ModelProduct
			const new_product = await ModelProduct.create({
				"name"    : req.body["name"].toLowerCase(),
				"category": req.body["category"].toLowerCase(),
				"description" : req.body["description"],
				"quantity": req.body["quantity"],
				"price"   : req.body["price"],
				"urlImage": (req.file) ? `${imageUrl}/${req.file.filename}`: req.body["productURL"]
			});
			res.redirect("/admin/list-products")
		}
		catch (error) {
			console.error("Unexpected error")
			console.error("Failed to create product")
			console.error(error);
			return res.status(500).end();
		}
	}
}
/**
 * This function updates the attributes of the products that has been stored in the database
 * @param {Request} req 
 * @param {Response} res 
 */
async function page_update_product(req, res) {
	try {
		// Load the update product page according to req.params["uuidProduct"]
		const content = await ModelProduct.findOne({
			where: { 
				"uuidProduct": req.params["uuidProduct"] 
			},
		});
		// If the product is found, render the update product page
		if (content) {
			return res.render('staff/products/createProduct', {
				title: "wirela staff: update product",
				layout: "staff",
				"mode"   : "update",
				"content": content
			});
		}
		else {
			console.error(`Failed to retrieve product ${req.params["uuidProduct"]}`);
			console.error("error");
			return res.status(410).end();
		}
	}
	catch (error) {
		console.error(`Failed to retrieve product ${req.params["uuidProduct"]}`);
		console.error(error);
		return res.status(500).end();
	}
}

/**
 * This function finds the product in the database and update it's contents
 * @param {Request} res 
 * @param {Response} req 
 */
async function handle_update_product(req, res) {
	console.log("Incoming update request")
	// Add try and catch block to handle error (Not finished yet)
	const errors = []
	if (errors.length > 0) {
		res.render("staff/products/createProduct", {
			layout : "staff",
			mode: "create",
			"errors": errors,
			content : req.body
		})
	}
	try {
		const contents = await ModelProduct.findAll({
				where: { 
					"uuidProduct": req.params["uuidProduct"]
			}
		})
		const replaceFile = (req.file)? true: false;
		switch (contents.length) {
			case 0      : return res.redirect(410, "/admin/list-products")
			case 1      : break;
				default: return res.redirect(409, "/admin/list-products")
		}
		//	Ignore the uuid
		delete req.body["uuidProduct"];

		const data = {
			"name"    : req.body["name"],
			"category": req.body["category"],
			"description" : req.body["description"],
			"quantity": req.body["quantity"],
			"price"   : req.body["price"],
		}

		// Set previous_file as the file path (urlImage) of the current image
		const previous_file = contents[0].urlImage;
		// If the user uploads a new image, set the urlImage attribute to the file path of the new image
		if (replaceFile) {
			data["urlImage"] = `${imageUrl}/${req.file.filename}`;
		} else if (req.body["productURL"]) {
			data["urlImage"] = req.body["productURL"]
		}
		
		// This line updates the contents of the product 
		await (await contents[0].update(data)).save();

		// If the user uploads a new image, remove the previous image
		if (replaceFile) {
			remove_file(previous_file);
		}

		flash_message(res, FlashType.Success, "Product updated");
		return res.redirect(`/admin/list-products/${req.params["uuidProduct"]}`);
	}
	
	catch (error) {
		console.error("Failed to update product");
		console.error(error);

		if (req.file) {
			console.error("Removing uploaded file");
			remove_file(`./uploads/${req.file.filename}`)
		}
		return res.status(500).end();
	}
}


/**
 * This functions deletes the product from the database
 * @param {Request} res 
 * @param {Response} req 
 */

async function handle_delete_product(req, res) {
	console.log("Incoming delete request");
	try {
		// Remove the product with UUID of req.params["uuid"]
		const affected = await ModelProduct.destroy({where: { "uuidProduct": req.params["uuidProduct"]}});
		// If there is only 1 product being deleted, return a successful deletion
		if (affected == 1) {
			console.log(`Deleted product: ${req.params["uuidProduct"]}`);
			flash_message(res, FlashType.Success, "Product successfully deleted");
			return res.redirect("/admin/list-products");
		}
		// If there are more than 1 entries affected by the deletion, return 409 conflict error 
		else {
			console.error(`More than one entries affected by: ${req.params["uuidProduct"]}, Total: ${affected}`);
			return res.status(409).end();
		}
	}
	catch (error) {
		console.error(`Failed to delete product: ${req.params["uuidProduct"]}`);
		console.error(error);
		return res.status(500).end();
	}
}

import { Router, Request, Response, NextFunction } from 'express'
import { ModelProduct  } from '../../../models/models';
import { UserRole } from '../../../models/users'
import { flash_message, FlashType  } from '../../../helpers/flash-messenger';
import  productController from '../../../controller/productController';
import { getPagination, getPagingData } from '../../../controller/paginationController';
import { upload, remove_file, imageUrl} from '../../../helpers/imageUpload';
import { Op } from 'sequelize';

const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false    //	Whether we should strictly differenciate "/home/" and "/home"
});

// Retrieve
router.get('/list', authorizer, page_list_products);
router.get('/list/:uuid', authorizer, page_list_productitem);
// Create
router.get('/create', authorizer, page_create_product);
router.put('/create', authorizer, upload.single("productUpload"), handle_create_product);
router.get('/download', productController.download);
// Update/Delete
router.get('/update/:uuid', authorizer, page_update_product);
router.patch('/update/:uuid', authorizer, upload.single("productUpload"),handle_update_product);
router.delete("/delete/:uuid", authorizer, handle_delete_product);

module.exports = router;

function authorizer(req, res, next) {
	if (req.user.role === UserRole.Admin)
		return next();
	else
		return res.status(403);
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
			where: { "uuid": req.params["uuid"] },
		});
		// Render the product item
		if (content) {
			return res.render('staff/products/productDetail', {
				title: "wirela staff: product detail",
				layout: "staff",
				"content": content,
				pageCSS: "/css/staff/proddesc.css"
			});
		}
		else {
			console.error(`Failed to retrieve product ${req.params["uuid"]}`);
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
	var errors = []
	var regex  = /^\d+(,\d{1,2})?$/

	if (regex.test(req.body["quantity"])) {
		errors.push({message: "Invalid quantity: Please enter valid characters"})
	}
	if (regex.test(req.body["price"])) {
		errors.push({message: "Invalid price: Please enter valid characters"})
	}
	if (errors.length > 0) {
		return res.render("staff/products/createProduct", {
			layout : "staff",
			mode: "update",
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
			flash_message(res, FlashType.Success, `${req.body.name} has been added`);
			res.redirect("/admin/product/list")
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
		// Load the update product page according to req.params["uuid"]
		const content = await ModelProduct.findOne({
			where: { 
				"uuid": req.params["uuid"] 
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
			console.error(`Failed to retrieve product ${req.params["uuid"]}`);
			console.error("error");
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
async function handle_update_product(req, res) {
	console.log("Incoming update request")
	const content = await ModelProduct.findOne({
		where: { 
			"uuid": req.params["uuid"] 
		},
	});
	var errors = []
	var regex  = /(^(\+|\-)(0|([1-9][0-9]*))(\.[0-9]{1,2})?$)|(^(0{0,1}|([1-9][0-9]*))(\.[0-9]{1,2})?$) /
	if (regex.test(req.body["quantity"])) {
		errors.push({message: "Invalid quantity: Please enter valid characters"})
	}
	if (regex.test(req.body["price"])) {
		errors.push({message: "Invalid price: Please enter valid characters"})
	}
	if (errors.length > 0) {
		return res.render("staff/products/createProduct", {
			layout : "staff",
			title: "wirela: update product",
			mode: "update",
			"errors": errors,
			content : content
		})
	}
	try {
		const contents = await ModelProduct.findAll({
				where: { 
					"uuid": req.params["uuid"]
			}
		})
		const replaceFile = (req.file)? true: false;
		switch (contents.length) {
			case 0      : return res.redirect(410, "/admin/product/list")
			case 1      : break;
				default: return res.redirect(409, "/admin/product/list")
		}
		//	Ignore the uuid
		delete req.body["uuid"];

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
			if (previous_file !== `/img/no-image.jpg`) {
				remove_file(previous_file);
			}
		}

		flash_message(res, FlashType.Success, `Product ${req.params["uuid"]} updated`);
		return res.redirect(`/admin/product/list/${req.params["uuid"]}`);
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
		const product_uuid = req.body.uuid
		// Remove the product with UUID of req.params["uuid"]
		const affected = await ModelProduct.destroy({where: { "uuid": req.params["uuid"]}});
		// If there is only 1 product being deleted, return a successful deletion
		if (affected == 1) {
			console.log(`Deleted product: ${req.params["uuid"]}`);
			flash_message(res, FlashType.Info, `Product ${req.params["uuid"]} successfully deleted`);
			return res.redirect("/admin/product/list");
		}
		// If there are more than 1 entries affected by the deletion, return 409 conflict error 
		else {
			console.error(`More than one entries affected by: ${req.params["uuid"]}, Total: ${affected}`);
			return res.status(409).end();
		}
	}
	catch (error) {
		console.error(`Failed to delete product: ${req.params["uuid"]}`);
		console.error(error);
		return res.status(500).end();
	}
}

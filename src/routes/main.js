import { Router, Request, Response } from 'express'
import { flash_message, FlashType  } from '../helpers/flash-messenger'
import { ModelUser } from '../models/users';
import { ModelProduct } from '../models/products';
import { getPagination, getPagingData } from '../controller/paginationController';
import { Op } from 'sequelize';


const router = Router({
	caseSensitive: false,
	mergeParams  : false,
	strict       : false
});
export const products = [
	{
		product: "Apple IPhone X",
		desc: "Latest innovation",
		price: 1000.55,
	},
	{
		product: "Samsung X",
		desc: "Next generation camera feature",
		price: 500.55,
	},
	{
		product: "Oppo Xfinity",
		desc: "Biggest screen",
		price: 200.55,
	},
	{
		product: "Lightning Cable",
		desc: "The most overpriced product we have",

		price: 4000.55,
	},
];
/**
 * Base routes
 */
router.get('/',      page_home);
router.get('/about', page_about);
router.get('/catalog', page_catalog)
router.get('/profile', page_profile)
router.get('/cart', page_cart)
router.get('/thankyou', page_ty)
;
/**
 * Subroutes 
 */
router.use('/auth',      require('./auth'));
router.use('/admin',     require('./admin/admin'));
router.use('/cart', 	 require('./cart'));
//	This route contains examples
router.use('/examples',  require('./examples/examples'));

module.exports = router;


async function page_profile(req, res) {
	try {
		const content = await ModelUser.findOne({
			where: { "uuid": req.user.uuid},
	});
		if (content) {
			return res.render('user/profile/userProfile', {
				name : req.user.name,
				email : req.user.email,
				password: req.user.password,
				title: "wirela - my profile",
				"content": content,
				pageCSS: "/css/user/profile.css"
			});
		}
		else {
			console.error(`Failed to retrieve user ${req.params["uuid"]}`);
			console.error("error");
			return res.status(410).end();
		}
	} catch (error) {
		console.log("Internal server error")
		console.error(error)
		return res.status(500).end()
	}
}

async function page_catalog(req, res) {
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
		return res.render('catalog', {
			title: "wirela: catalog",
			products: data.products,
			numOfProducts: data.productCount,
			totalItems: totalProduct,
			currentPage: data.currentPage,
			totalPages: data.totalPages,
			"pageCSS": "/css/user/catalog.css",
			"pageJS": "/js/catalog.js"
		})
	} catch (error) {
		console.error("Failed to retrieve products from database");
		console.error(error);
		return res.status(500).end();
	}
}



async function page_cart(req, res) {
	// Set pagination attributes
	var size = 10;
	const { page, search } = req.query;
	console.log(search)
	const { limit, offset } = getPagination(page, size)
	try {
		const Products = await ModelProduct.findAndCountAll({limit:limit, offset:offset})
		var totalProduct = await ModelProduct.count()
		var data = getPagingData(Products, page, limit)
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
			console.log("size: ", data.cartCount)
			console.log("total items: ", totalProduct)
			console.log("total pages: ", data.totalPages);
			console.log("current page: ", data.currentPage);
		}
		return res.render('cart', {
			title: "wirela: catalog",
			products: data.products,
			numOfProducts: data.productCount,
			totalItems: totalProduct,
			currentPage: data.currentPage,
			totalPages: data.totalPages,
			"pageCSS": "/css/user/cart.css",
			"pageJS": "/js/cart.js"
		})
	} catch (error) {
		console.error("Failed to retrieve products from database");
		console.error(error);
		return res.status(500).end();
	}
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

async function page_ty(req, res) {
	try {
		const content = await ModelUser.findOne({
			// Find a product according to req.params["uuid"]
	});
		if (content) {
			return res.render('user/orders/thankyou', {
				title: "wirela - payment success",
				"content": content,
			});
		}
		else {
			console.error(`Failed to retrieve user ${req.params["uuid"]}`);
			console.error("error");
			return res.status(410).end();
		}
	} catch (error) {
		console.log("Internal server error")
		console.error(error)
		return res.status(500).end()
	}
}


router.get('/add/:id', function(req, res, next) {

	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	var product = products.filter(function(item) {
	  return item.id == productId;
	});
	cart.add(product[0], productId);
	req.session.cart = cart;
	res.redirect('/');
	inline();
  });
  
  router.get('/cart', function(req, res, next) {
	if (!req.session.cart) {
	  return res.render('cart', {
		products: null
	  });
	}
	var cart = new Cart(req.session.cart);
	res.render('cart', {
	  title: 'NodeJS Shopping Cart',
	  products: cart.getItems(),
	  totalPrice: cart.totalPrice
	});
  });
  
  router.get('/remove/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
  
	cart.remove(productId);
	req.session.cart = cart;
	res.redirect('/cart');
  });
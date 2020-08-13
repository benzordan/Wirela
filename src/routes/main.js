import { Router, Request, Response } from 'express'
import { flash_message, FlashType  } from '../helpers/flash-messenger'
import { ModelUser } from '../../build/models/users';
import { ModelProduct } from '../models/products';
import { getPagination, getPagingData } from '../controller/paginationController';
import { Op } from 'sequelize';

const router = Router({
	caseSensitive: false,
	mergeParams  : false,
	strict       : false
});

/**
 * Base routes
 */
router.get('/',      page_home);
router.get('/catalog', page_catalog);
/**
 * Subroutes 
 */
router.use('/auth',      require('./auth'));
router.use('/admin',     require('./admin/admin'));
router.use('/cart', 	 require('./cart'));
//	This route contains examples
router.use('/examples',  require('./examples/examples'));
module.exports = router;

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
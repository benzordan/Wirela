import { Router, Request, Response } from 'express'
import { flash_message, FlashType  } from '../helpers/flash-messenger'
import { ModelUser, ModelOrder } from '../models/models'
import { UserRole } from '../../build/models/users';
import { products } from './main';

const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false    //	Whether we should strictly differenciate "/home/" and "/home"
});

/**
 * =============
 * Cart Routes
 * =============
 * /cart
 * /cart/payment
 * /checkout (method)
 * /cart/thankyou
 */

router.use("/", authorizer);
router.get('/', page_default);
router.get('/payment', page_payment);
router.get('/thankyou', page_thankyou);
router.put('/checkout', handle_checkout);


module.exports = router;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM('<html></html>');
var $ = require('jquery')(window);

function authorizer(req, res, next) {
    next();
}

function page_default(req, res) {
    res.render('/cart', {
        products: products,
        "pageCSS": "/css/user/cart.css",
        "pageJS": "/js/order.js"
    });
}

function page_payment(req, res) {
    return res.render('user/orders/payment', {
        "pageCSS": "/css/user/payment.css",
        "pageJS": "/js/cart.js",
    });
}

function page_thankyou(req, res) {
    return res.render('user/orders/thankyou', {
        "pageCSS": "/css/user/thankyou.css"
    })
}

/**
 * @param {Request} request
 * @param {Response} response
 */
async function handle_checkout(req, res) {
    try {
        const new_order = await ModelOrder.create({
            "name": req.params["name"],
            "price": req.params["price"],
            "quantity": req.params["quantity"],
            "product": req.params["product"],
        });
        return res.redirect('/payment');
    }
    catch (error) {
        console.error("Failed to create order");
        console.error(error);
        return res.render('/cart', {
            "text": "Order Failed. Please try again"
        })
    }

}

  






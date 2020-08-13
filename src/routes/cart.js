import { Router, Request, Response } from 'express'
import { flash_message, FlashType  } from '../helpers/flash-messenger'
import { ModelUser, ModelOrder } from '../models/models'
import { UserRole } from '../../build/models/users';
import { products } from './main';

const router = Router({
	caseSensitive: false,
	mergeParams  : false,
	strict       : false
});

router.get('/', page_default);
router.get('/payment', page_payment);
router.get('/thankyou', page_thankyou);
router.put('/checkout', handle_checkout);

module.exports = router;

function page_default(req, res) {
    res.render('user/orders/cart', {
        products: products,
        "pageCSS": "/css/user/cart.css",
        "pageJS": "/js/order.js"
    });
}

function page_payment(req, res) {
    return res.render('user/orders/payment', {
        "pageCSS": "/css/user/payment.css"
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
            "uuid_order": uuid_order,
            "orderDate": orderDate,
            
        });
        return res.redirect('/cart/thankyou');
    }
    catch (error) {
        console.error("Failed to create order");
        console.error(error);
        return res.render('user/orders/cart', {
            "text": "Order Failed. Please try again"
        })
    }

}

var fadeTime = 300;

/* reculculate cart */
function recalculatecart(){
    var subtotal = 0;  
}

/* update quantity */
function updateQuantity(quantityInput)
{
    /* calculate line price */
    var productRow = $(quantityInput).parent().parent();
    var price = parseFloat(productRow.children('.cart-price cart-column').text());
    var quantity = $(quantityInput).val();
    var lineprice = price * quantity;

    /*update line price display and recalc cart totals */
    productRow.children('.cart-total cart-column').each(function(){
        $(this).fadeout(fadeTime, function(){
            $(this).text(lineprice.toFixed(2));
            recalculatecart();
            $(this).fadeIn(fadeTime);
        });
    });
}

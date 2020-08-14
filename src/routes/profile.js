import { Router, Request, Response } from 'express'
import { flash_message, FlashType  } from '../helpers/flash-messenger'
import { ModelVideo, ModelUser, ModelOrder } from '../models/models'
import { UserRole } from '../../build/models/users';

const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false    //	Whether we should strictly differenciate "/home/" and "/home"
});

/** 
 * 
 * /profile
 * 
 * =================
 *  Order List Routes
 * ==================
 * /profile/order
 * /profile/order/:orderId
 * 
 */

router.use('/', authorizer);
router.get('/');
router.get('/order', page_order_list);
router.get('/order/:orderId', page_order_item);

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */

 // NICHOLAS set authorizer condition for user to enter profile pages
function authorizer(req, res, next) {
    if (req.user == undefined) {
        // Item
    } 
    else {
        next();
    }
}

/**
 * Render order page
 * @param {Request} request Express request object
 * @param {Response} response Express response object
 */

// profile/order
// findAll & render params incomplete
async function page_order_list(req, res) {
    try {
        // if statement to find user orders
        const orders = await ModelOrder.findAll({
            raw: true
        })
        return res.render('user/profile/orderList', {
            "orders": orders
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).end();
    }
}

/**
 * 
 * @param {Request} request 
 * @param {Response} response 
 */

// profile/order/:orderId
// render params incomplete
async function page_order_item(req, res) {
    try {
        const order = await ModelVideo.findOne({
            where: {"orderId": req.params["orderId"]}
        });
        if (order) {
            return res.render('user/profile/indvOrder', {
                "order": order
            })
        }
    }
    catch (error) {
        console.error(`Failed to retrieve order ${req.params["orderId"]}`);
        console.error(error);
        return res.status(500).end();
    }
}
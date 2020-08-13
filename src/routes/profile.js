import { Router, Request, Response } from 'express'
import { flash_message, FlashType  } from '../helpers/flash-messenger'
import { ModelUser, ModelOrder } from '../models/models'
import { UserRole } from '../../build/models/users';

const router = Router({
	caseSensitive: false,
	mergeParams  : false,
	strict       : false
});

router.use('/', authorizer);
router.get('/');
router.get('/order', page_order_list);
router.get('/order/:orderId', page_order_item);

/**
 * This function authorizes the user to enter their own profile page
 * @param {Request} req 
 * @param {Response} res 
 */

function authorizer(req, res, next) {
    if (req.user == UserRole.User) {
        // Item
    } 
    else {
        next();
    }
}

/**
 * This function displays the list of orders created by the user
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
 * This function displays a page for each order
 * @param {Request} request 
 * @param {Response} response 
 */

// profile/order/:orderId
// render params incomplete
async function page_order_item(req, res) {
    try {
        const order = await ModelOrder.findOne({
            where: {"uuid_order": req.params["uuid_order"]}
        });
        if (order) {
            return res.render('user/profile/indvOrder', {
                "order": order
            })
        }
    }
    catch (error) {
        console.error(`Failed to retrieve order ${req.params["uuid_order"]}`);
        console.error(error);
        return res.status(500).end();
    }
}
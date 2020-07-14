import { Router, Request, Response } from 'express'
import { flash_message, FlashType  } from '../helpers/flash-messenger'

const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false    //	Whether we should strictly differenciate "/home/" and "/home"
});

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */


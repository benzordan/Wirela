import { Response } from 'express'

export const FlashType = {
	Success: "Success",
	Info   : "Info",
	Warn   : "Warn",
	Error  : "Error"
}

/**
 * Flash a message.
 * @see "https://www.npmjs.com/package/flash-messenger"
 * @param {Response}      response 	HTTP outgoing response object
 * @param {string}        type		flashType
 * @param {string}        message 	The message to be shown
 * @param {string}        icon 		The icon used
 * @param {boolean}       isDismissable Whether we can dismiss the box
 */
export function flash_message(response, type, message, icon, isDismissable = true) {

	const messenger = response.flashMessenger;
	var   alert     = null;
	
	switch(type) {
		case FlashType.Success: 
			alert = messenger.success(message);
			break;

		case FlashType.Info: 
			alert = messenger.info(message);
			break;

		case FlashType.Warn: 
			alert = messenger.danger(message);
			break;

		case FlashType.Error: 
			alert = messenger.error(message);
			break;
		
		default: 
			alert = messenger.info(message);
			break;
	}
	alert.titleIcon      = icon;
	alert.canBeDismissed = isDismissable;
}
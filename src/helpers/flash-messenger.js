import { Response } from 'express'

export const FlashType = {
	Success: "Success",
	Info   : "Info",
	Warn   : "Warn",
	Error  : "Error"
}

/**
 * Flash a message.
 * If you encounter "Handlebars: Access has been denied to resolve the property "alertsBeforeFlush" because it is not an "own property" of its parent."
 * 	Install the package "@handlebars/allow-prototype-access"
 * @see "https://www.npmjs.com/package/flash-messenger"
 * @param {Response}      response 	The response object of the current request
 * @param {string}        type		See {FlashType}
 * @param {string}        message 	The message to be shown
 * @param {string}        icon 		The icon used. See from FontAwesome
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
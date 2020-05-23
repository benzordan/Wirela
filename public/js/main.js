/**
 * Initialization trigger
 * @param {Event} event The window event produced
 */
window.addEventListener('load', (event) => {
	console.log("Initializing");
	$('[data-toggle=confirmation]').confirmation({
		rootSelector: '[data-toggle=confirmation]',
	});
	console.log(document.body.innerHTML);
	//	Insert your hooks here
	console.log("Initialized");
});

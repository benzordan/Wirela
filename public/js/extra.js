/**
 * Initialization trigger
 * @param {Event} event The window event produced
 */
window.addEventListener('load', (event) => {
	console.log("Initializing");
	//** First leve code here */

	//	This is Okay, Safe
	//	Why? -> By the time this predicate is called. Every thing is the document will be well defined.
	// document.getElementById("hello").addEventListener("click", function () {

	// });
	console.log("Initialized");
});

//	If you write here
//	YOU WILL ALMOST 100% GET undefined ERROR
// document.getElementById("hello").addEventListener("click", function () {

// });
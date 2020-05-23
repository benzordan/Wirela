window.addEventListener('load', (event) => {
	console.log("Initializing");
	//	Call this function after 5 seconds
	setTimeout(make_api_request, 5000);

	console.log("Initialized");
});

function make_api_request() {
	const request = new XMLHttpRequest();
	request.open("POST", "/examples/client-api-request", true);
	
	request.onreadystatechange = function() {
		if (this.readyState != 4) return;
		switch (this.status) {
			case 200: 
			{
				console.log("Http Request Success");
				const progress = document.getElementById("progress-bar");
				const success  = document.getElementById("status-load-success");
				const content  = document.getElementById("content");
				
				content.innerHTML      = this.response;
				success.style.display  = 'block';
				progress.style.display = 'none';
			}
			break;

			default: 
			{
				console.log("Http Request Failed");
				const progress   = document.getElementById("progress-bar");
				const failedMsg  = document.getElementById("status-load-failed");
				const failedCode = document.getElementById("status-code");

				progress.display        = 'none';
				failedMsg.style.display = 'block';
				failedCode.innerHTML    = `${this.status} ${this.statusText}`;
			}
			break;
		}
	}
	//	You must set this else you get body = blank
	request.setRequestHeader("Content-Type", "application/json");
	request.send(JSON.stringify({ "someData": 100 }));
}
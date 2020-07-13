const products = [
	{
		product: "Apple IPhone X",
		desc: "Latest innovation",
		price: 1000,
	},
	{
		product: "Samsung X",
		desc: "Next generation camera feature",
		price: 500,
	},
	{
		product: "Oppo Xfinity",
		desc: "Biggest screen",
		price: 200,
	},
	{
		product: "Lightning Cable",
		desc: "The most overpriced product we have",
		price: 40000,
	},
];

$(document).ready(function() {
    getCatalog();

})

function getCatalog() {
    for (i=0; i<products.length; i++){
        let div = document.createElement("div");
        let desc = document.createElement("span");
        div.innerHTML = products[i].product;
        $(".row").append(div);
    }
}

function addProduct() {

}

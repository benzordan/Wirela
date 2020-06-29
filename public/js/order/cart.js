$(document).ready(function() {
    console.log("Test");
    order.getProducts();
})

function getCart() {
    const products = JSON.stringify(localStorage);
    console.log(products)
}

function removeCartItem() {

}
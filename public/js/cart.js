


  /* reculculate cart */
function recalculatecart(){
    var subtotal = 0;  
};



/* Update quantity */
function updateQuantity(quantityInput)
{
  /* Calculate line price */
  var productRow = $(quantityInput).parent().parent();
  var price = parseFloat(productRow.children('.product-price').text());
  var quantity = $(quantityInput).val();
  var linePrice = price * quantity;
  
  /* Update line price display and recalc cart totals */
  productRow.children('.product-line-price').each(function () {
    $(this).fadeOut(fadeTime, function() {
      $(this).text(linePrice.toFixed(2));
      recalculateCart();
      $(this).fadeIn(fadeTime);
    });
  });  
}


/* Remove item from cart */
function removeItem()
{
  /* Remove row from DOM and recalc cart total */
  var productRow = $(removeButton).parent().parent();
  productRow.slideUp(fadeTime, function() {
    productRow.remove();
    recalculateCart();
  });
}

var fadeTime = 300;
// document.addEventListener('change',function(event){
//     updateQuantity(this);
// });

/* Assign actions */
$('.product-quantity input').change( function() {
    updateQuantity(this);
  });
  
  $('.product-removal button').click( function() {
    removeItem(this);
  });
$(document).ready(function () {
    // Toggle filter menu
    $("#filter").click(function(){
        if ($(".filter-menu").css("visibility") == "hidden") {
            $(".filter-menu").css("visibility", "visible");
        } else {
            $(".filter-menu").css("visibility", "hidden");
        }
    });
    // Sort items in ascending order by name
    $('.nameAsc').on('click', function() {
        var alphabeticallyOrderedDivs = $('.product').sort(function (a, b) {
            return $(a).find(".product-name").text() > $(b).find(".product-name").text();
        });
        $(".product-list").html(alphabeticallyOrderedDivs);
    });
    // Sort items in descending order by name
    $('.nameDes').on('click', function() {
        var alphabeticallyOrderedDivs = $('.product').sort(function (a, b) {
            return $(a).find(".product-name").text() < $(b).find(".product-name").text();
        });
        $(".product-list").html(alphabeticallyOrderedDivs);
    });
    // Sort items in Ascending order by price
    $('.priceAsc').on('click', function() {
        var numericallyOrderedDivs = $('.product').sort(function (a, b) {
            return $(a).data("price")-$(b).data("price")
        });
        $(".product-list").html(numericallyOrderedDivs);
    });
    // Sort items in Descending order by price
    $('.priceDes').on('click', function() {
        var numericallyOrderedDivs = $('.product').sort(function (a, b) {
            return $(b).data("price")-$(a).data("price")
        });
        $(".product-list").html(numericallyOrderedDivs);
    });
});
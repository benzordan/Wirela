$(document).ready(function() {
    $('#productUpload').on('change', uploadImage)
    
    function uploadImage() {
        $("#product-image").attr('src', data.file);
        $("#productURL").attr('value', data.file);
    }
});
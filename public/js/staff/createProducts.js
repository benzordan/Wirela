$(document).ready(function() {
    $('#productUpload').on('change', uploadImage)
    
    function uploadImage() {
        let image = $("#productUpload")[0].files[0];
        let formdata = newFormData();
        formdata.append('productUpload', image);
        $.ajax({
            url: '/create-product/upload',
            type: 'POST',
            data: formdata,
            contentType: false,
            processData: false,
            'success':(data) => {
                $("#product-image").attr('src', data.file);
                $("#productURL").attr('value', data.file);
                if (data.err) {
                    $("#productErr").show();
                    $("#productErr").text(data.err.message);
                } else {
                    $("#productErr").hide();
                }
            }
        })
    }
});
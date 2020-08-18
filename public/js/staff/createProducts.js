$(document).ready(function() {
    $imgSrc = $('#productUpload').attr('src');
        function readURL(input) {

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#productImage').attr('src', e.target.result);
                };

                reader.readAsDataURL(input.files[0]);
            }
        }
    $('#productUpload').on('change', function () {
        readURL(this);
        $('#productImage').attr('src', $imgSrc);
    });
});
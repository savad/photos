/**
 * Created by sayone on 30/6/15.
 */

var files = []
$(window).load(function(){

    function handleImage(e) {

    }


});

//$(document).ready(function() {
//    $('#image_form').submit(function(e) {
//        files = event.target.files;
//        var data = new FormData();
//        $.each(files, function(i, file) {
//            data.append('image', file);
//        });
//        data.append("type", 'image');
//        $.ajax({
//            data: data,
//            type: "POST",
//            url: "/api/v1/upload-image/",
//            dataType: 'json',
//            processData: false,
//            contentType: false,
//            xhr: function() {
//                var myXhr = $.ajaxSettings.xhr();
//                if(myXhr.upload){ // Check if upload property exists
//                    myXhr.upload.addEventListener('progress',function(e){
//                        if(e.lengthComputable){
//                            $('#profile-image-progress-bar').attr({value:e.loaded,max:e.total});
//                        }
//                    }, false); // For handling the progress of the upload
//                }
//                return myXhr; },
//            success: function(data) { // on success..
//                if(data.status=="success")
//                {
//
//                    $('#profile-image').val('');
//                }
//            }
//        });
//    });
//
// });

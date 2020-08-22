/**
 * Created by savad on 23/7/17.
 */
function ApveraController($scope, $http, $localStorage, $location, $route, $filter, $sce){


    $scope.login_window = true;
    $scope.token = $localStorage.token;
    $scope.itemToAdd = undefined;


    $scope.logout = function () {
        delete $localStorage.token;
        $location.path('/login/');
    };

    $scope.showSignUp = function () {
        $scope.login_window = false;
    };

    $scope.showLogin = function () {
        $scope.login_window = true;
    };


    $scope.login = function () {
        $scope.login_error = false;
        $http({
            method: 'POST',
            url: '/auth/login/',
            headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
            data: $.param({'username': $scope.login_username, 'password': $scope.login_password})
            })
        .then(function(response) {
                $localStorage.token = response.data.auth_token;
                $location.path('/profile/');
        },
        function(data) {
            $scope.login_error = data.data;
        });
    };


    $scope.signUp = function () {
        $scope.sign_up_error = false;
        $('#sign_up_button').attr('value', 'Please wait');
        $http({
            method: 'POST',
            url: '/auth/register/',
            headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
            data: $.param({'username':$scope.username,
                           'first_name': $scope.first_name,
                           'email': $scope.username,
                           'password': $scope.password})
            })
        .then(function(response) {
                swal({
                  title: "Success",
                  text: "Verification email sent. Please check your email and follow instructions.",
                  type: "success",
                  confirmButtonText: "OK"
                },
                function(){
                    $('#sign_up_form')[0].reset();
                    $('#sign_up_button').attr('value', 'Sign Up');
                });
        },
        function(data) {
            $scope.sign_up_error = data.data;
            $('#sign_up_button').attr('value', 'Sign Up');
        });
    };

    $scope.activateAccount = function () {
        $http({
            method: 'POST',
            url: '/auth/activate/',
            headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
            data: $.param({'token': $route.current.params.token, 'uid': $route.current.params.uid})
            })
        .then(function(response) {
                swal({
                  title: "Verified",
                  text: "Please login to continue!",
                  type: "success",
                  confirmButtonText: "Go to Login"
                },
                function(){
                  $('#activate_text').html("Successfully verified.");
                  $location.path('/');
                });
        },
        function(data) {
            $('#activate_text').html("<p class='red'>Inalid or exprired link</p>");
        });
    };


    $scope.passwordChange = function () {
        $scope.password_error = false;
        $http({
            method: 'POST',
            url: '/auth/password/',
            headers : {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization': 'Token ' + $scope.token},
            data: $.param({'current_password':$scope.current_password,
                           'new_password': $scope.new_password,
                           're_new_password': $scope.re_new_password})
            })
        .then(function(response) {
                swal({
                  title: "Success",
                  text: "Your password successfully changed",
                  type: "success",
                  confirmButtonText: "OK"
                },
                function(){
                  $('#password_form')[0].reset();
                  $location.path('/profile/');
                });
        },
        function(data) {
            $scope.password_error = data.data;
        });
    };

    $scope.onUserFilter = function() {
        var searchword = '#';
        var custfilter = new RegExp(searchword, "#");
        var repstr = "" + searchword + "";
        if (searchword != "") {
            $('body').each(function() {
                $(this).html($(this).html().replace(custfilter, repstr));
            })
        }
    }

    $scope.orderBy =  [ {code: 'latest', name: 'Latest'}, {code: 'oldest', name: 'Oldest'}];

    $scope.orderChange = function() {
        $scope.imageList = [];
        $http.get("/api/v1/images/?order="+$scope.order.code, {headers: {'Authorization': 'Token ' + $scope.token}})
        .then(function(response) {
            $scope.imageList = response.data;
        },
        function(data) {
            $scope.imageListError = data.data;
        });
    }

    $scope.onUserFilter = function() {
        $scope.imageList = [];
        $http.get("/api/v1/images/?user="+$scope.userFilter, {headers: {'Authorization': 'Token ' + $scope.token}})
        .then(function(response) {
            $scope.imageList = response.data;
        },
        function(data) {
            $scope.imageListError = data.data;
        });
    }

    // User Listing
    $scope.userList = function () {
        $http.get("/api/v1/user/?", {headers: {'Authorization': 'Token ' + $scope.token}})
        .then(function(response) {
            $scope.userList = response.data;
        },
        function(data) {
            $scope.userListError = data.data;
        });
    };

    // Tag Listing
    $scope.getTagList = function () {
        $http.get("/api/v1/tags/", {headers: {'Authorization': 'Token ' + $scope.token}})
        .then(function(response) {
            $scope.tagList = response.data;
        },
        function(data) {
            $scope.tagListError = data.data;
        });
    };

    // Filter Hash Tag
    $scope.filterHashTag = function (param) {
        $http.get("/api/v1/images/?tag="+param, {headers: {'Authorization': 'Token ' + $scope.token}})
        .then(function(response) {
            $scope.imageList = response.data;
        },
        function(data) {
            $scope.imageListError = data.data;
        });
    };

    // Photo Listing
    $scope.imageList = function (param) {
        $http.get("/api/v1/images/?"+param, {headers: {'Authorization': 'Token ' + $scope.token}})
        .then(function(response) {
            $scope.imageList = response.data;
        },
        function(data) {
            $scope.imageListError = data.data;
        });
    };

    // Load Draft Image
    $scope.loadDraftImage = function (param) {
        $http.get("/api/v1/images/?"+param, {headers: {'Authorization': 'Token ' + $scope.token}})
        .then(function(response) {
            $('#draft').val(response.data[0].id);
            $scope.caption = response.data[0].caption;
            $('#thumb-img').attr('src', response.data[0].image);
            $('#thumb-img').attr('style', "display: inline-block");
        },
        function(data) {
            $scope.imageListError = data.data;
        });
    };

    // Upload Photo
    $scope.imageSubmit = function (files, type) {
        var formData = new FormData();
        formData.append("file", files);
        formData.append("caption", $scope.caption);
        $scope.image_error = false;
        id = $("#draft").val();

        $http({
            method: 'POST',
            url: '/api/v1/upload-image/?id='+id+'&'+type,
            headers : {'Content-Type' : undefined, 'Authorization': 'Token ' + $scope.token},
            transformRequest: angular.identity,
            data: formData
            })
        .then(function(response) {
                if(type=='draft=false'){$("#draft").val("");}
                swal({
                  title: "Success",
                  text: "Your image successfully saved",
                  type: "success",
                  confirmButtonText: "OK"
                },
                function(){
                    if(type=='draft=false'){
                        $('#thumb-img').attr('style', 'display: none')
                        $('#image_form')[0].reset();
                        $location.path('/profile/');
                    }else{
                        $("#draft").val(response.data.data.id);
                    }
                });
        },
        function(data) {
            $scope.image_error = data;
        });
    };

    // Photo Delete
    $scope.imageDelete = function (id) {
        $scope.image_error = false;
        $http({
            method: 'DELETE',
            url: '/api/v1/delete-image/'+id+'/',
            headers : {'Content-Type' : undefined, 'Authorization': 'Token ' + $scope.token}
            })
        .then(function(response) {
                swal({
                  title: "Success",
                  text: "Image successfully removed",
                  type: "success",
                  confirmButtonText: "OK"
                },
                function(){
                    $('#'+id).remove()
                });
        },
        function(data) {
            $scope.image_error = data;
        });
    };

}

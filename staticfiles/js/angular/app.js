/**
 * Created by savad on 23/7/17.
 */
'use strict';
var app = angular.module('apvera', ['ngRoute', 'ngStorage']);

app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);

//cors config
app.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  // delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/static/templates/image_list.html',
			controller: 'ApveraController'
		})
		.when('/my-photos/', {
			templateUrl: '/static/templates/my_photos.html',
			controller: 'ApveraController'
		})
		.when('/upload-photo/', {
			templateUrl: '/static/templates/upload_photo.html',
			controller: 'ApveraController'
		})
		.when('/change-password/', {
			templateUrl: '/static/templates/change_password.html',
			controller: 'ApveraController'
		})
        .when('/login/', {
			templateUrl: '/static/templates/login.html',
			controller: 'ApveraController'
		})
        .when('/activate/:uid/:token/', {
			templateUrl: '/static/templates/activate.html',
			controller: 'ApveraController'
		})
		.otherwise({
			redirectTo: '/'
		});
});

app.run(['$rootScope', '$location', '$localStorage', '$sce', function($rootScope, $location, $localStorage, $sce) {
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        var logged = $localStorage.token;

        var restrictedPage = $.inArray($location.path(), ['/login/']) === -1;

        if(restrictedPage && !logged && !$location.path().startsWith("/activate/")) {
            event.preventDefault();
            $location.path('/login/');
        }
    });
}]);

// Image Upload directive
app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                        $('#thumb-img').attr('src', loadEvent.target.result).width(45).height(35);
                        $('#thumb-img').attr('style', "display: inline-block");
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);

            });
        }
    }
}]);

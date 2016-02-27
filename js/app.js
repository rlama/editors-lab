// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myapp = angular.module('starter', ['ionic']);

myapp.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});


myapp.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
	$stateProvider
	/*.state('tabs', {
	  url: '/tab',
	  abstract: true,
	  templateUrl: 'templates/tabs.html'
	})*/

	/* .state('tabs.home', {
	   url: '/home',
	   views: {
	     'home-tab' : {
	       templateUrl: 'templates/home.html'
	     }
	   }
	 })*/

		.state('home', {
		url: '/',
		templateUrl: 'templates/home.html'

	})


	.state('tabs.list', {
		url: '/list',
		views: {
			'list-tab': {
				templateUrl: 'templates/list.html',
				controller: 'ListController'
			}
		}
	})

	.state('tabs.detail', {
		url: '/list/:aId',
		views: {
			'list-tab': {
				templateUrl: 'templates/detail.html',
				controller: 'ListController'
			}
		}
	})

	.state('tabs.calendar', {
		url: '/calendar',
		views: {
			'calendar-tab': {
				templateUrl: 'templates/calendar.html',
				controller: 'CalendarController'
			}
		}
	})


	.state('photo', {
			url: '/photo',

			templateUrl: 'templates/photo.html'

		})
	.state('video', {
			url: '/video',

			templateUrl: 'templates/video.html'

		})
	.state('text', {
		url: '/text',

		templateUrl: 'templates/text.html'

	})


	$urlRouterProvider.otherwise('/');
});

myapp.controller('CalendarController', ['$scope', '$http', '$state',
    function ($scope, $http, $state) {
		$http.get('js/data.json').success(function (data) {
			$scope.calendar = data.calendar;

			$scope.onItemDelete = function (dayIndex, item) {
				$scope.calendar[dayIndex].schedule.splice($scope.calendar[dayIndex].schedule.indexOf(item), 1);
			}

			$scope.doRefresh = function () {
				$http.get('js/data.json').success(function (data) {
					$scope.calendar = data.calendar;
					$scope.$broadcast('scroll.refreshComplete');
				});
			}

			$scope.toggleStar = function (item) {
				item.star = !item.star;
			}

		});
}]);

myapp.controller('ListController', ['$scope', '$http', '$state', 'Camera',
    function ($scope, $http, $state, Camera) {

		$http.get('js/data.json').success(function (data) {
			$scope.artists = data.artists;
			$scope.whichartist = $state.params.aId;
			$scope.data = {
				showDelete: false,
				showReorder: false
			};

			$scope.onItemDelete = function (item) {
				$scope.artists.splice($scope.artists.indexOf(item), 1);
			}

			$scope.doRefresh = function () {
				$http.get('js/data.json').success(function (data) {
					$scope.artists = data;
					$scope.$broadcast('scroll.refreshComplete');
				});
			}

			$scope.toggleStar = function (item) {
				item.star = !item.star;
			}

			$scope.moveItem = function (item, fromIndex, toIndex) {
				$scope.artists.splice(fromIndex, 1);
				$scope.artists.splice(toIndex, 0, item);
			};

		});
		
		
		$scope.imageUrl ;
		$scope.getPhoto = function () {
			
			console.log("jdjdjd");

			Camera.getPicture().then(function(imageURI) {

				//console.log(imageURL);
				$scope.imageUrl  = imageURI
				$location.path('/photo');

				
			}, function (err) {
				
				
				//console.log(err)
			})
		};
		
		$scope.videoUrl ;
		$scope.getVideo = function () {

			Camera.getVideo().then(function(videoURI) {

				//console.log(imageURL);
				$scope.videoUrl = videoURI
				$location.path('/video');

				
			}, function (err) {

				//console.log(err)
			})
		};
		
		

}]);

myapp.factory('Camera', ['$q', function ($q) {

	return {
		getPicture: function (options) {
			var q = $q.defer();

			navigator.camera.getPicture(function (result) {
				// Do any magic you need
				q.resolve(result);
			}, function (err) {
				q.reject(err);
			}, options);

			return q.promise;
		},
		getVideo: function (options) {
			var q = $q.defer();
			 navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});
			
			navigator.device.capture.captureVideo(function(result){
				q.resolve(result);
			}, function(err){
				q.reject(err);
			}, {limit: 1});
			

			return q.promise;
		}
	}
}]);
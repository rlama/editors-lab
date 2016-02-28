// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myapp = angular.module('starter', ['ionic', 'ngSanitize']);

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

		.state('home', {
		url: '/',
		templateUrl: 'templates/home.html'

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



myapp.controller('MainController', ['$scope', '$http', '$state', 'Camera', '$location', '$sce',
    function ($scope, $http, $state, Camera, $location, $sce) {

		/*$http.get('js/data.json').success(function (data) {
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

		});*/


		$scope.imgURI = "";

		$scope.takePicture = function () {

			//$scope.imgURI = "img/Jonathan_Ferrar_tn.jpg";
			Camera.takePicture().then(function (imageURI) {
				//$scope.imageUrl = "data:image/jpeg;base64," + imageURI;
				$scope.imageUrl = imageURI;
				$location.path('/photo');
			}, function (err) {

			})
		};

		$scope.videoURI;//  = $sce.trustAsResourceUrl("http://player.vimeo.com/external/85569724.sd.mp4?s=43df5df0d733011263687d20a47557e4");
		$scope.getVideo = function () {

			Camera.getVideo().then(function (videoURI) {

				//console.log(imageURL);
				$scope.videoURI  = videoURI;
				
				$location.path('/video');


			}, function (err) {

				//console.log(err)
			})
		};
		
		function captureSuccess(mediaFiles) {
			var i, len;
			for (i = 0, len = mediaFiles.length; i < len; i += 1) {
				uploadFile(mediaFiles[i]);
			}
		}

		function uploadFile(mediaFile) {
			var ft = new FileTransfer(),
				path = mediaFile.fullPath,
				name = mediaFile.name;
			var options = new FileUploadOptions();
			options.mimeType = "video/mpeg";
			options.fileName = name;
			options.chunkedMode = true;

			ft.upload(path,
				"http://192.154.23.51/upload.php",
				function (result) {
					console.log('Upload success: ' + result.responseCode);
					console.log(result.bytesSent + ' bytes sent');
				},
				function (error) {
					console.log('Error uploading file ' + path + ': ' + error.code);
				},
				options);
		}

}]);

myapp.factory('Camera', ['$q', function ($q) {

	return {
		takePicture: function (options) {
			var q = $q.defer();

			navigator.camera.getPicture(function (result) {
				// Do any magic you need
				q.resolve(result);
			}, function (err) {
				q.reject(err);
			}, {
				quality: 50,
				destinationType: Camera.DestinationType.FILE_URI
			});

			return q.promise;
		},


		getVideo: function (options) {
			var q = $q.defer();


			navigator.device.capture.captureVideo(function (result) {
				q.resolve(result);
			}, function (err) {
				q.reject(err);
			}, {
				limit: 1
			});


			return q.promise;
		}
	}
}]);
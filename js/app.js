// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myapp = angular.module('starter', ['ionic', 'ngSanitize', 'ngCordova']);

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



myapp.controller('MainController', ['$scope', '$http', '$state', 'Camera', '$location', '$sce', '$cordovaFileTransfer',
    function ($scope, $http, $state, Camera, $location, $sce, $cordovaFileTransfer) {

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

			
			console.log("TAKING PICTURE");
			//$scope.imgURI = "img/Jonathan_Ferrar_tn.jpg";
			Camera.takePicture().then(function (imageURI) {
				//$scope.imageUrl = "data:image/jpeg;base64," + imageURI;
				$scope.imageUrl = imageURI;
				$scope.fileUpload(imageURI);
				$location.path('/photo');
				console.log("PICTURE TAKEN");
			}, function (err) {

			})
		};

		$scope.videoURI; //  = $sce.trustAsResourceUrl("http://player.vimeo.com/external/85569724.sd.mp4?s=43df5df0d733011263687d20a47557e4");
		$scope.getVideo = function () {

			Camera.getVideo().then(function (videoURI) {

				//console.log(imageURL);
				$scope.videoURI = videoURI[0].fullPath;

				$location.path('/video');


			}, function (err) {

				//console.log(err)
			})
		};


		$scope.fileUpload = function (img) {
			// Destination URL 
			var url = "http://lamainteractives/uploads/uploadImage.php";

			//File for Upload
			var targetPath = img ;//cordova.file.externalRootDirectory + "logo_radni.png";
			// File name only
			var filename = targetPath.split("/").pop();

			var options = {
				fileKey: "file",
				fileName: filename,
				chunkedMode: false,
				mimeType: "image/jpg"
				
			};

			$cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
				console.log("SUCCESS: " + JSON.stringify(result.response));
			}, function (err) {
				console.log("ERROR: " + JSON.stringify(err));
			}, function (progress) {
				// PROGRESS HANDLING GOES HERE
			});
		}
		
		//$scope.fileUpload("img/iconic.png");

		$scope.console = "";


		/*$scope.upload = function (file) {
			var options = {
				fileKey: "avatar",
				fileName: "image.png",
				chunkedMode: false,
				mimeType: "image/png"
			};
			$cordovaFileTransfer.upload("http://lamainteractives.com/uploads", file, options).then(function (result) {
				//console.log("SUCCESS: " + JSON.stringify(result.response));
				$scope.console = result;
			}, function (err) {
				$scope.console = err;
				//console.log("ERROR: " + JSON.stringify(err));
			}, function (progress) {
				$scope.console = err;
				 $timeout(function () {
					$scope.downloadProgress = (progress.loaded / progress.total) * 100;
				  })
			});
		}




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
*/
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